import { type NextRequest, NextResponse } from "next/server"
import { getAllProducts, getProductsByCategory, createProduct, searchProducts } from "@/lib/services/product-service"
import { verifyToken } from "@/lib/services/auth-service"

// GET /api/products - Obtener todos los productos o filtrar por categoría o búsqueda
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const query = searchParams.get("query")

    let products

    if (category) {
      products = await getProductsByCategory(category)
    } else if (query) {
      products = await searchProducts(query)
    } else {
      products = await getAllProducts()
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// POST /api/products - Crear un nuevo producto (requiere autenticación)
export async function POST(request: NextRequest) {
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

    // Validar datos requeridos
    if (!productData.name || !productData.brand || !productData.price || !productData.category) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const newProduct = await createProduct(productData)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}

