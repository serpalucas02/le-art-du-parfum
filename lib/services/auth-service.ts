import clientPromise from "../mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Nombre de la base de datos y colección
const DB_NAME = "fragancias"
const COLLECTION_NAME = "admins"

// Interfaz para el administrador
export interface Admin {
  _id?: string
  username: string
  password: string
  name?: string
  email?: string
  createdAt?: Date
  updatedAt?: Date
}

// Verificar si existe un administrador
export async function checkAdminExists(): Promise<boolean> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const count = await db.collection(COLLECTION_NAME).countDocuments({})
  return count > 0
}

// Crear un administrador inicial si no existe ninguno
export async function createInitialAdmin(adminData: Admin): Promise<Admin | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  // Verificar si ya existe un administrador
  const exists = await checkAdminExists()
  if (exists) {
    return null
  }

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(adminData.password, salt)

  // Añadir timestamps
  const now = new Date()
  const adminWithHashedPassword = {
    ...adminData,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  }

  // Remover _id si existe para que MongoDB lo genere como ObjectId
  const { _id, ...adminToInsert } = adminWithHashedPassword

  const result = await db.collection(COLLECTION_NAME).insertOne(adminToInsert)

  return {
    ...adminWithHashedPassword,
    _id: result.insertedId.toString(),
    password: "[PROTECTED]", // No devolver la contraseña real
  }
}

// Autenticar un administrador
export async function authenticateAdmin(username: string, password: string): Promise<string | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  // Buscar el administrador por nombre de usuario
  const admin = await db.collection(COLLECTION_NAME).findOne({ username })

  if (!admin) {
    return null
  }

  // Verificar la contraseña
  const isMatch = await bcrypt.compare(password, admin.password)

  if (!isMatch) {
    return null
  }

  // Generar token JWT
  const token = jwt.sign(
    { id: admin._id.toString(), username: admin.username },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1d" },
  )

  return token
}

// Verificar token JWT
export async function verifyToken(token: string): Promise<{ id: string; username: string } | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { id: string; username: string }
    return decoded
  } catch (error) {
    return null
  }
}
