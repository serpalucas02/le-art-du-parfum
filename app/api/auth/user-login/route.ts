import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const DB_NAME = "fragancias"
const COLLECTION_NAME = "users"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB_NAME)

    // Buscar el usuario por email
    const user = await db.collection(COLLECTION_NAME).findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Comparar la contraseña ingresada con la almacenada (encriptada)
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "1d" }
    )

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error al iniciar sesión (usuario):", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
