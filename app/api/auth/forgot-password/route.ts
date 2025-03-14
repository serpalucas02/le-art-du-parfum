// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const DB_NAME = "fragancias"
const COLLECTION_NAME = "users"

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "El email es requerido" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME); // Reemplaza por el nombre real
    const user = await db.collection(COLLECTION_NAME).findOne({ email });

    // Por seguridad, devolvemos el mismo mensaje incluso si el usuario no existe.
    if (!user) {
      return NextResponse.json({ message: "Si el correo existe, recibirás instrucciones." });
    }

    // Generamos un token con una expiración corta (por ejemplo, 1 hora)
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET || "tu-clave-secreta",
      { expiresIn: "1h" }
    );

    // Configura tu transportador de correo (por ejemplo, usando nodemailer)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true", // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construye la URL para resetear la contraseña
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cuenta/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM, // Por ejemplo, "no-reply@tudominio.com"
      to: email,
      subject: "Recuperación de contraseña",
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetUrl}`,
      html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Si el correo existe, recibirás instrucciones." });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
  }
}
