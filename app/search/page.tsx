// app/search/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import { searchProducts } from "@/lib/services/product-service"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function SearchPage({ searchParams }: { searchParams: { query?: string } }) {
  // En algunos casos, searchParams puede ser asíncrono, así que lo esperamos
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const query = resolvedSearchParams.query || ""

  if (!query.trim()) {
    notFound() // O muestra un mensaje indicando que no se ingresó un término
  }

  const products = await searchProducts(query)

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
            <BreadcrumbLink href="/search">Resultados de búsqueda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>{query}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            Resultados para: <span className="text-amber-500">"{query}"</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id as string}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  imageUrl={product.imageUrl}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  No se encontraron productos para "{query}".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
