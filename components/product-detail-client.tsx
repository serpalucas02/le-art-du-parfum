"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { toast } from "@/hooks/use-toast"

interface ProductDetailProps {
  _id: string
  name: string
  brand: string
  price: number
  description: string
  imageUrl: string
}

interface ProductDetailClientProps {
  product: ProductDetailProps
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    // Agrega el producto con la cantidad seleccionada
    addItem({
      id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      imageUrl: product.imageUrl,
    })

    toast({
      title: "Producto agregado",
      description: `${product.name} se ha agregado al carrito`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tarjeta principal */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Imagen del producto */}
          <div className="md:w-1/2">
            <div className="aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>
          {/* Sección de detalles */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-black mb-2">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-black mb-4">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>
            </div>
            <div className="flex items-stretch gap-4">
            {/* Selección de cantidad */}
            <div className="flex items-center border rounded-md h-12">
                <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                <Minus className="h-4 w-4" />
                </button>
                <span className="flex items-center justify-center px-4 text-black">
                {quantity}
                </span>
                <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                <Plus className="h-4 w-4" />
                </button>
            </div>
            {/* Botón Agregar al carrito */}
            <Button
                onClick={handleAddToCart}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white flex items-center"
            >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al carrito
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
