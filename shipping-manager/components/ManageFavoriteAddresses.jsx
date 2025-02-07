"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const ManageFavoriteAddresses = ({ favorites, onAdd, onRemove }) => {
  const [newName, setNewName] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [newNumeracion, setNewNumeracion] = useState("")
  const [newLocality, setNewLocality] = useState("")
  const { toast } = useToast()

  const handleAddFavorite = async () => {
    if (newName.trim() && newAddress.trim() && newNumeracion.trim() && newLocality.trim()) {
      try {
        const response = await axios.post(
          "https://vicortantes.com.ar/etiquetas-pedidos/api.php?action=crear_favorito",
          {
            nombre: newName.trim(),
            direccion: newAddress.trim(),
            numeracion: newNumeracion.trim(),
            localidad: newLocality.trim(),
          },
        )
        if (response.data.success) {
          onAdd({
            nombre: newName.trim(),
            direccion: newAddress.trim(),
            numeracion: newNumeracion.trim(),
            localidad: newLocality.trim(),
          })
          setNewName("")
          setNewAddress("")
          setNewNumeracion("")
          setNewLocality("")
          toast({
            title: "Favorito agregado",
            description: response.data.message,
          })
        } else {
          throw new Error(response.data.message || "Error al agregar favorito")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveFavorite = async (favorite) => {
    try {
      const response = await axios.post(
        "https://vicortantes.com.ar/etiquetas-pedidos/api.php?action=eliminar_favorito",
        { id: favorite.id },
      )
      if (response.data.success) {
        onRemove(favorite)
        toast({
          title: "Favorito eliminado",
          description: response.data.message,
        })
      } else {
        throw new Error(response.data.message || "Error al eliminar favorito")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Gestionar Direcciones Favoritas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Direcciones Favoritas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input placeholder="Nombre" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input placeholder="Dirección" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
            <Input placeholder="Numeración" value={newNumeracion} onChange={(e) => setNewNumeracion(e.target.value)} />
            <Input placeholder="Localidad" value={newLocality} onChange={(e) => setNewLocality(e.target.value)} />
            <Button onClick={handleAddFavorite}>Agregar</Button>
          </div>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {favorites.map((favorite, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{favorite.nombre}</div>
                    <div className="text-sm text-gray-500">
                      {favorite.direccion} {favorite.numeracion}
                    </div>
                    <div className="text-sm text-gray-500">{favorite.localidad}</div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveFavorite(favorite)}>
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ManageFavoriteAddresses

