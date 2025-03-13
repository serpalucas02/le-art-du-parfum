"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { Package, PlusCircle, Search, Edit, Trash2, LogOut, Home } from "lucide-react"
import type { Product } from "@/lib/models/product"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [token, setToken] = useState<string | null>(null)

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem("adminAuthenticated")
      const adminToken = localStorage.getItem("adminToken")

      if (isAdmin !== "true" || !adminToken) {
        router.push("/admin/login")
        return
      }

      setIsAuthenticated(true)
      setToken(adminToken)
      fetchProducts()
    }

    checkAuth()
  }, [router])

  // Cargar productos desde la API
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products")

      if (!response.ok) {
        throw new Error("Error al cargar productos")
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Buscar productos
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts()
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/products?query=${encodeURIComponent(searchTerm)}`)

      if (!response.ok) {
        throw new Error("Error al buscar productos")
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al buscar productos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") {
      fetchProducts()
    }
  }

  // Manejar tecla Enter en el campo de búsqueda
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const handleDeleteProduct = async (id: string) => {
    if (!token) return

    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el producto")
      }

      // Actualizar la lista de productos
      setProducts(products.filter((product) => product._id !== id))

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products

  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Esto no debería mostrarse ya que redirigimos en el useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-white">
                <Home className="mr-2 h-4 w-4" />
                Ir a la tienda
              </Button>
            </Link>
            <Button variant="ghost" className="text-white" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cabecera y acciones */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center text-black">
              <Package className="mr-2 h-5 w-5" />
              Gestión de Productos
            </h2>
            <p className="text-gray-600">Administra los productos de tu tienda</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full sm:w-64"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            <Link href="/admin/products/new">
              <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Producto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Categoría
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Precio Efectivo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Cargando productos...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 object-cover"
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.effectivePrice?.toLocaleString() || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/edit/${product._id}`}>
                            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteProduct(product._id as string)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

