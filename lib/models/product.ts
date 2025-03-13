// Definición del tipo de producto para usar en toda la aplicación
export interface Product {
  _id?: string
  name: string
  brand: string
  description?: string
  price: number
  effectivePrice?: number
  category: string
  imageUrl: string
  installments?: number
  installmentPrice?: number
  discount?: number
  available?: boolean
  location?: string
  createdAt?: Date
  updatedAt?: Date
}

// Función para calcular el precio efectivo basado en el precio regular
export function calculateEffectivePrice(price: number, discount?: number): number {
  if (discount && discount > 0) {
    return Math.round(price * (1 - discount / 100))
  }
  // Por defecto, 30% de descuento para efectivo
  return Math.round(price * 0.7)
}

// Función para calcular el precio de cuotas
export function calculateInstallmentPrice(price: number, installments = 6): number {
  return Math.round(price / installments)
}

