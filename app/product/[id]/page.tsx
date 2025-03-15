import { getProductById } from "@/lib/services/product-service"
import ProductDetailClient from "@/components/product-detail-client"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Esperamos a que params se resuelva (aunque normalmente es síncrono, esto satisface la validación de Next.js)
  const { id } = await Promise.resolve(params)
  const product = await getProductById(id)
  if (!product || !product._id) {
    notFound()
  }
  return <ProductDetailClient product={{ ...product, _id: product._id!, description: product.description ?? "" }} />
}
