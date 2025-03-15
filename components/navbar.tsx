"use client"

import { useEffect, useState, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, ShoppingCart, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

export default function Navbar() {
  const router = useRouter()
  const { itemCount } = useCart()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Verifica si existe un token en localStorage para determinar el estado de autenticación
    const token = localStorage.getItem("userToken")
    setIsAuthenticated(!!token)
  }, [])

  // Manejador del submit para la búsqueda
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <>
      <div className="w-full bg-black text-white text-center py-2 text-xs md:text-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          AFNAN | ANFAR | ARMAF | ASDAAF | BHARARA | LATTAFA | MAISON | MAWWAL | PARIS CORNER | RASASI
        </div>
      </div>
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Menú móvil */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2 md:hidden text-white">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menú</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-black text-white border-r border-gray-800 w-[250px] sm:w-[300px]"
                >
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="/hombre" className="px-2 py-2 hover:bg-gray-800 rounded-md">
                      HOMBRE
                    </Link>
                    <Link href="/mujer" className="px-2 py-2 hover:bg-gray-800 rounded-md">
                      MUJER
                    </Link>
                    <Link href="/decants" className="px-2 py-2 hover:bg-gray-800 rounded-md">
                      DECANTS
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center">
                <span className="text-xl md:text-2xl font-bold text-white">LE ART DU PARFUM</span>
              </Link>
            </div>

            {/* Barra de búsqueda */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input
                  type="search"
                  placeholder="¿Qué estás buscando?"
                  className="w-full bg-gray-900 border-gray-700 pl-4 pr-10 py-2 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full aspect-square p-2">
                  <Search className="h-5 w-5 text-gray-400" />
                </Button>
              </form>
            </div>

            <div className="flex items-center space-x-2 md:space-x-6">
              <button className="md:hidden text-white">
                <Search className="h-6 w-6" />
              </button>

              {/* Menú de usuario */}
              {/* <div className="flex flex-col items-center text-sm text-gray-300 hover:text-white">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-col items-center">
                      <User className="h-6 w-6 mb-1" />
                      <span className="hidden md:inline">Mi cuenta</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href="/cuenta/perfil">Mi perfil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/cuenta/pedidos">Mis pedidos</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setIsAuthenticated(false)}
                        className="text-red-500 cursor-pointer"
                      >
                        Cerrar sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/cuenta/iniciar-sesion" className="flex flex-col items-center">
                    <User className="h-6 w-6 mb-1" />
                    <span className="hidden md:inline">Iniciar sesión</span>
                  </Link>
                )}
              </div> */}

              <Link
                href="/carrito"
                className="flex flex-col items-center text-sm text-gray-300 hover:text-white relative"
              >
                <ShoppingCart className="h-6 w-6 mb-1" />
                <span className="hidden md:inline">Mi carrito</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <nav className="bg-black border-b border-gray-800 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8 justify-center py-3 text-sm">
            <li>
              <Link href="/hombre" className="text-gray-300 hover:text-white">
                HOMBRE
              </Link>
            </li>
            <li>
              <Link href="/mujer" className="text-gray-300 hover:text-white">
                MUJER
              </Link>
            </li>
            <li>
              <Link href="/decants" className="text-gray-300 hover:text-white">
                DECANTS
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
