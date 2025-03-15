"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import type { Product } from "@/lib/models/product"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    // discount: "",
    // installments: "6",
    category: "",
    imageUrl: "",
    available: true,
    // location: "showroom",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
      fetchProduct()
    }

    checkAuth()
  }, [router, productId])

  // Cargar producto desde la API
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)

      if (!response.ok) {
        throw new Error("Error al cargar el producto")
      }

      const product: Product = await response.json()

      setFormData({
        name: product.name,
        brand: product.brand,
        description: product.description || "",
        price: product.price.toString(),
        // discount: product.discount ? product.discount.toString() : "",
        // installments: product.installments ? product.installments.toString() : "6",
        category: product.category,
        imageUrl: product.imageUrl,
        available: product.available !== false,
        // location: product.location || "showroom",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el producto",
        variant: "destructive",
      })
      router.push("/admin/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error cuando el usuario selecciona una categoría
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del producto es requerido"
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es requerida"
    }

    if (!formData.price.trim()) {
      newErrors.price = "El precio es requerido"
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "El precio debe ser un número positivo"
    }

    if (!formData.category) {
      newErrors.category = "La categoría es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !token) {
      return
    }

    setIsSaving(true)

    try {
      // Preparar los datos para enviar a la API
      const productData = {
        ...formData,
        price: Number(formData.price),
        // discount: formData.discount ? Number(formData.discount) : undefined,
        // installments: Number(formData.installments),
      }

      // Enviar datos a la API
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar el producto")
      }

      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado correctamente",
      })

      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al panel
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-900">
                  Nombre del producto <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-1 text-gray-900">
                  Marca <span className="text-red-500">*</span>
                </label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={errors.brand ? "border-red-500" : ""}
                />
                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1 text-gray-900">
                  Precio <span className="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* <div>
                <label htmlFor="discount" className="block text-sm font-medium mb-1 text-gray-900">
                  Descuento (%)
                </label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opcional. Si no se especifica, se aplicará 30% por defecto para efectivo.
                </p>
              </div> */}

              {/* <div>
                <label htmlFor="installments" className="block text-sm font-medium mb-1 text-gray-900">
                  Cuotas
                </label>
                <Select
                  value={formData.installments}
                  onValueChange={(value) => handleSelectChange("installments", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona las cuotas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 cuotas</SelectItem>
                    <SelectItem value="6">6 cuotas</SelectItem>
                    <SelectItem value="12">12 cuotas</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-900">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hombre">Hombre</SelectItem>
                    <SelectItem value="mujer">Mujer</SelectItem>
                    <SelectItem value="decants">Decants</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1 text-gray-900">
                  Ubicación
                </label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} />
              </div> */}

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-900">
                  Descripción
                </label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1 text-gray-900">
                  URL de la imagen
                </label>
                <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
                <p className="text-xs text-gray-500 mt-1">Deja en blanco para usar la imagen por defecto</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/dashboard">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" className="bg-black hover:bg-gray-800 text-white" disabled={isSaving}>
                {isSaving ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

