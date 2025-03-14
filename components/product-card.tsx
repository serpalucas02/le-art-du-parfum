"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { toast } from "@/hooks/use-toast"

interface ProductCardProps {
  id: string
  name: string
  brand: string
  price: number
  effectivePrice?: number
  // installments?: number
  // installmentPrice?: number
  discount?: number
  imageUrl: string
  // location?: string
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  effectivePrice,
  // installments,
  // installmentPrice,
  discount,
  imageUrl,
  // location = "showroom",
}: ProductCardProps) {
  const { addItem } = useCart()

  // Calcular effectivePrice si no se proporciona
  const calculatedEffectivePrice = effectivePrice ?? Math.round(price * 0.7) // 30% de descuento por defecto

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      brand,
      price,
      effectivePrice: calculatedEffectivePrice,
      imageUrl,
    })

    toast({
      title: "Producto agregado",
      description: `${name} se ha agregado al carrito`,
    })
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/producto/${id}`} className="block relative">
        <div className="aspect-square overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            width={300}
            height={300}
            className="w-full h-full object-contain p-4"
          />
        </div>
        {discount && (
          <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/producto/${id}`} className="block">
          <h3 className="font-medium text-center mb-4 h-12 line-clamp-2 text-black">{name}</h3>

          <div className="text-center mb-2">
            <p className="text-xl font-bold text-black">${price.toLocaleString()}</p>
            <p className="text-sm text-gray-700">${calculatedEffectivePrice.toLocaleString()} en Efectivo</p>
            {/* {location && <p className="text-xs text-gray-500">(Disponible en {location})</p>} */}
          </div>

          {/* {installments && installmentPrice && (
            <p className="text-xs text-center text-gray-500 mb-4">
              {installments} cuotas sin interés de ${installmentPrice.toLocaleString()}
            </p>
          )} */}
        </Link>

        <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>
    </div>
  )
}

