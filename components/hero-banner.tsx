import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[500px] bg-black overflow-hidden">
      <div
        className="absolute inset-0 bg-[url('/banner.webp')] bg-cover bg-center opacity-70"
        // style={{ backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))" }}
      />

      {/* <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold text-white mb-2">
            <span className="text-amber-500">2025</span>
          </h1>
          <div className="mb-6">
            <div className="flex items-center">
              <div>
                <p className="text-white text-lg">EFECTIVO</p>
                <p className="text-7xl font-bold text-white">
                  30<span className="text-4xl">%</span>
                </p>
                <p className="text-4xl font-bold text-white">
                  25<span className="text-2xl">OFF</span>
                </p>
                <p className="text-sm text-white">TRANSFERENCIA</p>
              </div>
              <div className="mx-8 h-32 w-px bg-gray-500"></div>
              <div>
                <p className="text-white text-lg mb-2">HASTA</p>
                <p className="text-[120px] leading-none font-bold text-gray-300">6</p>
                <p className="text-2xl font-bold text-white">CUOTAS</p>
                <p className="text-xl font-bold text-white">SIN INTERÉS</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-bold text-white mb-2">ENVÍO GRÁTIS</p>
            <p className="text-lg text-gray-300">SUPERANDO $250.000</p>
          </div>

          <div className="mt-8">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-6 text-lg">
              Ver Ofertas <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  )
}

