import HeroBanner from "@/components/hero-banner"
import NewsletterPopup from "@/components/newsletter-popup"
import BenefitsSection from "@/components/benefits-section"
import FeaturedProducts from "@/components/featured-products"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <HeroBanner />

      <BenefitsSection />

      <FeaturedProducts />

      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">DESCUBRE NUESTRA COLECCIÓN COMPLETA</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explora nuestra amplia selección de fragancias premium para hombre y mujer. Encuentra tu aroma perfecto
            entre las mejores marcas internacionales.
          </p>
          <Link href="/hombre">
            <Button className="bg-black hover:bg-gray-800 text-white px-6">
              Ver Catálogo <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* <NewsletterPopup /> */}
    </>
  )
}
