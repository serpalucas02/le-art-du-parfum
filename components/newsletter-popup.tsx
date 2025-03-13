"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md max-w-md w-full p-6 relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Ofertas y novedades</h3>
          <p className="text-gray-600">¡Suscríbete para recibir descuentos exclusivos!</p>
        </div>

        <form className="space-y-4">
          <Input type="email" placeholder="Email" className="w-full border-gray-300" required />
          <Input type="text" placeholder="Nombre" className="w-full border-gray-300" required />
          <Button className="w-full bg-black hover:bg-gray-800 text-white">Suscribirme</Button>
          <p className="text-xs text-gray-500 text-center">Recibirás un correo para validar tu email.</p>
        </form>
      </div>
    </div>
  )
}

