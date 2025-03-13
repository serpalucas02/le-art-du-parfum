import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import ProductCard from "@/components/product-card"
import { getProductsByCategory } from "@/lib/services/product-service"

export default async function MensFragrancesPage() {
  // Cargar productos de la categoría "hombre"
  const products = await getProductsByCategory("hombre")

  // Lista de marcas para el filtro
  const brands = [
    { name: "Acqua Di Parma", count: 2 },
    { name: "Adolfo Dominguez", count: 2 },
    { name: "Afnan", count: 15 },
    { name: "Al Haramain", count: 15 },
    { name: "Antonio Banderas", count: 17 },
    { name: "Armaf", count: 23 },
    { name: "Armani", count: 10 },
    { name: "Azzaro", count: 13 },
  ]

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
            <BreadcrumbLink href="/perfumes">Perfumes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>Perfumes de hombre</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar con filtros */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-black">Filtrar por</h2>

            {/* Filtro por marca */}
            <div className="mb-8">
              <h3 className="font-bold mb-4 text-black">Marca</h3>
              <div className="space-y-3 text-black">
                {brands.map((brand) => (
                  <div key={brand.name} className="flex items-center">
                    <Checkbox id={`brand-${brand.name}`} className="mr-2" />
                    <label htmlFor={`brand-${brand.name}`} className="text-sm cursor-pointer flex-1">
                      {brand.name} ({brand.count})
                    </label>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-xs">
                Ver todos
              </Button>
            </div>

            {/* Filtro por precio */}
            <div>
              <h3 className="font-bold mb-4 text-black">Precio</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Desde</label>
                  <Input type="number" placeholder="19982" className="text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hasta</label>
                  <Input type="number" placeholder="985400" className="text-sm" />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Perfumes de Hombre</h1>
            <div className="flex items-center">
              <Button variant="outline" className="flex items-center gap-2">
                Más Vendidos <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id as string}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  effectivePrice={product.effectivePrice}
                  installments={product.installments}
                  installmentPrice={product.installmentPrice}
                  discount={product.discount}
                  imageUrl={product.imageUrl}
                  location={product.location}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No se encontraron productos en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

