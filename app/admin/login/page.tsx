"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(false)

  // Verificar si se necesita configurar un administrador
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch("/api/auth/setup")
        const data = await response.json()

        if (!data.exists) {
          setNeedsSetup(true)
        }
      } catch (error) {
        console.error("Error al verificar configuración:", error)
      }
    }

    checkSetup()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Si necesita configuración, crear el primer administrador
      if (needsSetup) {
        const setupResponse = await fetch("/api/auth/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!setupResponse.ok) {
          const errorData = await setupResponse.json()
          throw new Error(errorData.error || "Error al configurar administrador")
        }

        toast({
          title: "Administrador configurado",
          description: "El administrador ha sido configurado correctamente. Ahora puedes iniciar sesión.",
        })

        setNeedsSetup(false)
        setIsLoading(false)
        return
      }

      // Iniciar sesión
      const loginResponse = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json()
        throw new Error(errorData.error || "Credenciales incorrectas")
      }

      const { token } = await loginResponse.json()

      // Guardar token en localStorage
      localStorage.setItem("adminToken", token)
      localStorage.setItem("adminAuthenticated", "true")

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de administración",
      })

      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          {needsSetup ? "Configurar Administrador" : "Panel de Administrador"}
        </h1>

        <p className="text-gray-500 text-center mb-6">
          {needsSetup
            ? "Configura el primer usuario administrador para gestionar tu tienda"
            : "Ingresa tus credenciales para acceder al panel de administración"}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-900">
              Usuario <span className="text-red-500">*</span>
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-900">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
            {isLoading
              ? needsSetup
                ? "Configurando..."
                : "Iniciando sesión..."
              : needsSetup
                ? "Configurar Administrador"
                : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    </div>
  )
}

