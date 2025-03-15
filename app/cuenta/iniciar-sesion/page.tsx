"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Borrar error del campo al escribir
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

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
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
      // Se hace la petición al endpoint de inicio de sesión para usuarios
      const response = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión")
      }

      // Guardar el token en localStorage (y, si lo deseas, otros datos del usuario)
      localStorage.setItem("userToken", data.token)

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description:
          error instanceof Error
            ? error.message
            : "Email o contraseña incorrectos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // const handleGoogleSignIn = async () => {
  //   setIsLoading(true)

  //   try {
  //     // Simulación de inicio de sesión con Google
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     toast({
  //       title: "Inicio de sesión exitoso",
  //       description: "Has iniciado sesión con Google correctamente",
  //     })

  //     router.push("/")
  //   } catch (error) {
  //     toast({
  //       title: "Error al iniciar sesión",
  //       description:
  //         "Ha ocurrido un error con Google. Por favor, inténtalo de nuevo.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Iniciar sesión
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Los campos marcados con <span className="text-red-500">*</span> son obligatorios
        </p>

        {/* <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-3 px-4 mb-6 hover:bg-gray-50 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-black">Continuar con Google</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-300 absolute w-full"></div>
          <span className="bg-white px-2 text-sm text-gray-500 relative">O</span>
        </div> */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-900">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <Link href="/cuenta/recuperar-contrasena" className="text-sm text-black underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
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

          <div className="flex items-center mb-6">
            <div className="flex items-center h-5">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, rememberMe: checked === true }))
                }
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="rememberMe" className="text-gray-600">
                Recordarme
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link href="/cuenta/registro" className="text-black underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}
