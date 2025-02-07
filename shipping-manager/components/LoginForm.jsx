"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post("https://vicortantes.com.ar/etiquetas-pedidos/auth.php", {
        nombre: username,
        password: password,
      })

      const data = response.data
      console.log(data)

      if (data.success) {
        onLogin(data.data.token)
        toast({
          title: "Inicio de sesión exitoso",
          description: data.data.message,
        })
      } else {
        throw new Error("Credenciales inválidas")
      }
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      <Input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  )
}

export default LoginForm

