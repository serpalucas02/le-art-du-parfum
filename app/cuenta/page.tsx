import { redirect } from "next/navigation"

export default function AccountPage() {
  // Redirigir a la página de inicio de sesión
  redirect("/cuenta/iniciar-sesion")
}

