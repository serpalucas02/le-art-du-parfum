import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const DB_NAME = "fragancias"
const COLLECTION_NAME = "users"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token y contraseña son requeridos" }, { status: 400 })
    }

    // Verificar el token
    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "tu-clave-secreta")
    } catch (err) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 })
    }

    const userId = (payload as any).id
    if (!userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 })
    }

    // Conectar a la base de datos
    const client = await clientPromise
    const db = client.db(DB_NAME) // Asegúrate de usar el nombre correcto de tu DB

    // Buscar el usuario
    const user = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar la contraseña del usuario
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )

    return NextResponse.json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error)
    return NextResponse.json({ error: "Error al restablecer la contraseña" }, { status: 500 })
  }
}
