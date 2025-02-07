"use client"

import { useState, useEffect, useCallback } from "react"
import DatePicker from "@/components/DatePicker"
import ShippingList from "@/components/ShippingList"
import ShippingForm from "@/components/ShippingForm"
import ReportGenerator from "@/components/ReportGenerator"
import ImportShippings from "@/components/ImportShippings"
import ManageFavoriteAddresses from "@/components/ManageFavoriteAddresses"
import Modal from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import LoginForm from "@/components/LoginForm"

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [dailyShippings, setDailyShippings] = useState([])
  const [favoriteAddresses, setFavoriteAddresses] = useState([])
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    if (savedToken) {
      setToken(savedToken)
    }

    const savedFavorites = localStorage.getItem("favoriteAddresses")
    if (savedFavorites) {
      setFavoriteAddresses(JSON.parse(savedFavorites))
    }
  }, [])

  const fetchDailyShippings = useCallback(async (date) => {
    const formattedDate = date.toISOString().split("T")[0]
    try {
      const response = await axios.get(
        `https://vicortantes.com.ar/etiquetas-pedidos/api.php?action=consultar_envios&fecha=${formattedDate}`,
      )
      if (response.data.success) {
        setDailyShippings(response.data.data)
      } else {
        throw new Error(response.data.message || "Error al obtener los envíos")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [])

  useEffect(() => {
    fetchDailyShippings(selectedDate)
  }, [selectedDate, fetchDailyShippings])

  const handleAddShipping = async (newShipping) => {
  console.log(newShipping)
    try {
      const response = await axios.post(
        "https://vicortantes.com.ar/etiquetas-pedidos/api.php?action=agregar_envio",
        newShipping,
      )
      if (response.data.success) {
        setDailyShippings([...dailyShippings, { ...newShipping, id: response.data.id }])
        setIsAddModalOpen(false)
        toast({
          title: "Envío agregado",
          description: response.data.message,
        })
      } else {
        throw new Error(response.data.message || "Error al agregar el envío")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleAddFavorite = (favorite) => {
    const updatedFavorites = [...favoriteAddresses, favorite]
    setFavoriteAddresses(updatedFavorites)
    localStorage.setItem("favoriteAddresses", JSON.stringify(updatedFavorites))
  }

  const handleRemoveFavorite = (favoriteToRemove) => {
    const updatedFavorites = favoriteAddresses.filter((fav) => fav.id !== favoriteToRemove.id)
    setFavoriteAddresses(updatedFavorites)
    localStorage.setItem("favoriteAddresses", JSON.stringify(updatedFavorites))
  }

  const handleLogin = (newToken) => {
    setToken(newToken)
    localStorage.setItem("authToken", newToken)
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem("authToken")
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    })
  }

  const { toast } = useToast()

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestor de Envíos</h1>
        <LoginForm onLogin={handleLogin} />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestor de Envíos</h1>
          <Button onClick={handleLogout} variant="outline">
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <div className="flex justify-between items-center mb-4">
            <div className="space-x-2">
              <Button onClick={() => setIsAddModalOpen(true)}>Agregar Envío Manual</Button>
              <ManageFavoriteAddresses
                favorites={favoriteAddresses}
                onAdd={handleAddFavorite}
                onRemove={handleRemoveFavorite}
              />
            </div>
            <ImportShippings />
          </div>
          <ShippingList selectedDate={selectedDate} shippings={dailyShippings} setShippings={setDailyShippings} />
          <ReportGenerator />
        </div>
      </main>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Agregar Envío Manual">
        <ShippingForm
          selectedDate={selectedDate} 
          onSubmit={handleAddShipping}
          onCancel={() => setIsAddModalOpen(false)}
          favoriteAddresses={favoriteAddresses}
        />
      </Modal>
      <Toaster />
    </div>
  )
}

export default Home

