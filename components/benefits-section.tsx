import { CreditCard, Truck, Shield, Percent } from "lucide-react"

export default function BenefitsSection() {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center">
            <div className="bg-white p-4 rounded-full mr-4 shadow-md">
              <CreditCard className="h-8 w-8 text-gray-800" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">6 CUOTAS SIN INTERÉS</h3>
              <p className="text-sm text-gray-600">Con tarjetas Bancarizadas</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-white p-4 rounded-full mr-4 shadow-md">
              <Truck className="h-8 w-8 text-gray-800" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">ENVÍOS</h3>
              <p className="text-sm text-gray-600">A todo el país mediante Correo Argentino</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-white p-4 rounded-full mr-4 shadow-md">
              <Shield className="h-8 w-8 text-gray-800" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">100% ORIGINALES</h3>
              <p className="text-sm text-gray-600">Nuestros perfumes son 100% originales</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-white p-4 rounded-full mr-4 shadow-md">
              <Percent className="h-8 w-8 text-gray-800" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">DESCUENTOS</h3>
              <p className="text-sm text-gray-600">25% transferencia y 30% en efectivo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

