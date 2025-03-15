import Link from "next/link"
import { Facebook, Instagram, Twitter, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">LE ART DU PARFUM</h3>
            <p className="text-gray-400 mb-4">Tu tienda de perfumes premium con las mejores marcas y precios.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">CATEGORÍAS</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hombre" className="text-gray-400 hover:text-white">
                  Hombre
                </Link>
              </li>
              <li>
                <Link href="/mujer" className="text-gray-400 hover:text-white">
                  Mujer
                </Link>
              </li>
              <li>
                <Link href="/decants" className="text-gray-400 hover:text-white">
                  Decants
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-end">
            <Link href="/admin/login">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-gray-400 hover:text-white border-gray-700"
              >
                <Lock className="h-4 w-4" />
                Panel de Administrador
              </Button>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} LE ART DU PARFUM. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

