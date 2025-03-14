"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; token?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!token) {
      setErrors((prev) => ({ ...prev, token: "Token no válido" }))
    }
  }, [token])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.password
        return newErrors
      })
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    if (errors.confirmPassword) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.confirmPassword
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      newErrors.password = "La contraseña es requerida"
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer la contraseña")
      }

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido restablecida correctamente",
      })

      router.push("/cuenta/iniciar-sesion")
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, token: err.message }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Restablecer contraseña</h1>
        {errors.token && (
          <p className="text-red-500 text-xs mt-1 text-center mb-4">{errors.token}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-900">
              Nueva contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-12">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-900">
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Actualizando..." : "Actualizar contraseña"}
          </Button>
        </form>
      </div>
    </div>
  )
}
