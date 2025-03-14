import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

const DB_NAME = "fragancias"
const COLLECTION_NAME = "users"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { firstName, lastName, email, password } = data

    // Validación básica (puedes ampliar según tus necesidades)
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Conectar a la base de datos
    const client = await clientPromise
    const db = client.db(DB_NAME) // Reemplaza con el nombre real de tu DB

    // Verificar si el email ya existe
    const existingUser = await db.collection(COLLECTION_NAME).findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar el nuevo usuario
    const result = await db.collection(COLLECTION_NAME).insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Usuario registrado correctamente", userId: result.insertedId.toString() }, { status: 201 })
  } catch (error) {
    console.error("Error en el registro:", error)
    return NextResponse.json({ error: "Error en el registro" }, { status: 500 })
  }
}
