import { type NextRequest, NextResponse } from "next/server"
import { checkAdminExists, createInitialAdmin } from "@/lib/services/auth-service"

// POST /api/auth/setup - Configurar el primer administrador
export async function POST(request: NextRequest) {
  try {
    // Verificar si ya existe un administrador
    const exists = await checkAdminExists()

    if (exists) {
      return NextResponse.json({ error: "Ya existe un administrador configurado" }, { status: 400 })
    }

    const adminData = await request.json()

    // Validar datos requeridos
    if (!adminData.username || !adminData.password) {
      return NextResponse.json({ error: "Nombre de usuario y contraseña son requeridos" }, { status: 400 })
    }

    // Crear administrador inicial
    const admin = await createInitialAdmin(adminData)

    return NextResponse.json({ message: "Administrador configurado correctamente" }, { status: 201 })
  } catch (error) {
    console.error("Error al configurar administrador:", error)
    return NextResponse.json({ error: "Error al configurar administrador" }, { status: 500 })
  }
}

// GET /api/auth/setup - Verificar si existe un administrador
export async function GET() {
  try {
    const exists = await checkAdminExists()

    return NextResponse.json({ exists })
  } catch (error) {
    console.error("Error al verificar administrador:", error)
    return NextResponse.json({ error: "Error al verificar administrador" }, { status: 500 })
  }
}

