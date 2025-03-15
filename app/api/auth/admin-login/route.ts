import { type NextRequest, NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/services/auth-service"

// POST /api/auth/login - Iniciar sesión como administrador
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validar datos requeridos
    if (!username || !password) {
      return NextResponse.json({ error: "Nombre de usuario y contraseña son requeridos" }, { status: 400 })
    }

    // Autenticar administrador
    const token = await authenticateAdmin(username, password)

    if (!token) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}

