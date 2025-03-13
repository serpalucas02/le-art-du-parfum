"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)

    // Limpiar error cuando el usuario comienza a escribir
    if (errors.email) {
      setErrors({})
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido"
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
      // Simulación de envío de correo de recuperación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)

      toast({
        title: "Correo enviado",
        description: "Hemos enviado un correo con instrucciones para recuperar tu contraseña",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Recuperar contraseña</h1>

        {isSubmitted ? (
          <div className="text-center">
            <p className="mb-4">
              Hemos enviado un correo a <strong>{email}</strong> con instrucciones para recuperar tu contraseña.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam o inténtalo de nuevo.
            </p>
            <Link href="/cuenta/iniciar-sesion">
              <Button className="bg-black hover:bg-gray-800 text-white">Volver a inicio de sesión</Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Los campos marcados con <span className="text-red-500">*</span> son obligatorios
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-900">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar instrucciones"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/cuenta/iniciar-sesion" className="text-sm text-black inline-flex items-center">
                <ArrowLeft size={16} className="mr-1" /> Volver a inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

