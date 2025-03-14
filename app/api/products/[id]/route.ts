import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/product-service"
import { verifyToken } from "@/lib/services/auth-service"

// GET /api/products/[id] - Obtener un producto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params)
  try {
    const product = await getProductById(id)
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Actualizar un producto (requiere autenticación)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params)
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = await verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Procesar la solicitud
    const productData = await request.json()
    const updatedProduct = await updateProduct(id, productData)
    if (!updatedProduct) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Eliminar un producto (requiere autenticación)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params)
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = await verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Procesar la solicitud
    const success = await deleteProduct(id)
    if (!success) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
