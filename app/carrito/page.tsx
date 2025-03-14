"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, effectiveSubtotal, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))
  }

  const formatWhatsAppMessage = () => {
    const lineBreak = "%0A" // URL encoded line break

    let message = `*NUEVO PEDIDO*${lineBreak}${lineBreak}`

    // Información del cliente
    message += `*Datos del cliente:*${lineBreak}`
    message += `Nombre: ${customerInfo.name}${lineBreak}`
    message += `Email: ${customerInfo.email}${lineBreak}`
    message += `Teléfono: ${customerInfo.phone}${lineBreak}`
    message += `Dirección: ${customerInfo.address}${lineBreak}${lineBreak}`

    // Productos
    message += `*Productos:*${lineBreak}`
    items.forEach((item) => {
      message += `- ${item.name} (${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}${lineBreak}`
    })

    message += `${lineBreak}*Subtotal:* $${subtotal.toLocaleString()}${lineBreak}`
    message += `*Total con descuento efectivo:* $${effectiveSubtotal.toLocaleString()}${lineBreak}${lineBreak}`

    // Notas adicionales
    if (customerInfo.notes) {
      message += `*Notas:* ${customerInfo.notes}${lineBreak}${lineBreak}`
    }

    message += `Gracias por tu compra!`

    return message
  }

  const handleWhatsAppCheckout = () => {
    // Número de WhatsApp del vendedor (reemplazar con el número real)
    const phoneNumber = "5491168552829"
    const message = formatWhatsAppMessage()

    // Crear URL de WhatsApp con el mensaje
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank")
  }

  const isFormValid = () => {
    return customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.address
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-gray-400" />
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Parece que aún no has agregado ningún producto a tu carrito.</p>
          <Link href="/">
            <Button className="bg-black hover:bg-gray-800 text-white">Continuar comprando</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>Carrito</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-8">Tu Carrito</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Productos en el carrito */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-black">
              <div className="col-span-6">
                <h3 className="font-semibold">Producto</h3>
              </div>
              <div className="col-span-2 text-center">
                <h3 className="font-semibold">Precio</h3>
              </div>
              <div className="col-span-2 text-center">
                <h3 className="font-semibold">Cantidad</h3>
              </div>
              <div className="col-span-2 text-center">
                <h3 className="font-semibold">Total</h3>
              </div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="py-4 border-b last:border-b-0 text-black">
                <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                  {/* Producto (móvil y desktop) */}
                  <div className="flex items-center col-span-6 mb-4 md:mb-0">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>

                      {/* Precio (solo móvil) */}
                      <div className="flex justify-between items-center mt-2 md:hidden">
                        <p className="text-sm">${item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Precio (desktop) */}
                  <div className="hidden md:block col-span-2 text-center">
                    <p>${item.price.toLocaleString()}</p>
                  </div>

                  {/* Cantidad (móvil y desktop) */}
                  <div className="flex items-center justify-between md:justify-center col-span-2 mb-4 md:mb-0">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Eliminar (móvil) */}
                    <button onClick={() => removeItem(item.id)} className="text-red-500 md:hidden">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Total (desktop) */}
                  <div className="hidden md:flex md:items-center md:justify-between col-span-2">
                    <p className="text-center w-full">${(item.price * item.quantity).toLocaleString()}</p>

                    {/* Eliminar (desktop) */}
                    <button onClick={() => removeItem(item.id)} className="text-red-500 ml-4">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" className="text-sm" onClick={clearCart}>
                Vaciar carrito
              </Button>

              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4" /> Seguir comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Resumen y checkout */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 text-black">
            <h2 className="text-xl font-bold mb-6 text-black">Resumen del pedido</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Descuento efectivo</span>
                <span>-${(subtotal - effectiveSubtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>Total</span>
                <span>${effectiveSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold">Información de contacto</h3>

              <div>
                <label htmlFor="name" className="block text-sm mb-1">
                  Nombre completo *
                </label>
                <Input id="name" name="name" className="text-white" value={customerInfo.name} onChange={handleInputChange} required />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="text-white"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm mb-1">
                  Teléfono *
                </label>
                <Input id="phone" name="phone" type="number" className="text-white" value={customerInfo.phone} onChange={handleInputChange} required />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm mb-1">
                  Dirección de envío *
                </label>
                <Input id="address" name="address" className="text-white" value={customerInfo.address} onChange={handleInputChange} required />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm mb-1">
                  Notas adicionales
                </label>
                <Textarea id="notes" name="notes" className="text-white" value={customerInfo.notes} onChange={handleInputChange} rows={3} />
              </div>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleWhatsAppCheckout}
              disabled={!isFormValid()}
            >
              Finalizar compra por WhatsApp
            </Button>

            {!isFormValid() && (
              <p className="text-red-500 text-sm mt-2">Por favor completa todos los campos obligatorios.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

