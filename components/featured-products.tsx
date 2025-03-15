import ProductCard from "@/components/product-card"
import { getAllProducts } from "@/lib/services/product-service"

export default async function FeaturedProducts() {
  // Obtener todos los productos y seleccionar los primeros 4 como destacados
  const allProducts = await getAllProducts()
  const products = allProducts.slice(0, 4)

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">PRODUCTOS DESTACADOS</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id as string}
                name={product.name}
                brand={product.brand}
                price={product.price}
                // effectivePrice={product.effectivePrice}
                // installments={product.installments}
                // installmentPrice={product.installmentPrice}
                // discount={product.discount}
                imageUrl={product.imageUrl}
                // location={product.location}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No hay productos destacados disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

