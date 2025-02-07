import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const FavoriteAddresses = ({ favorites, onSelect, onAdd, onRemove }) => {
  const [newAddress, setNewAddress] = useState("")

  const handleAddFavorite = () => {
    if (newAddress.trim()) {
      onAdd(newAddress.trim())
      setNewAddress("")
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Direcciones Favoritas</h4>
      <div className="flex space-x-2">
        <Input
          placeholder="Nueva dirección favorita"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <Button onClick={handleAddFavorite}>Agregar</Button>
      </div>
      <ScrollArea className="h-[200px]">
        <ul className="space-y-2">
          {favorites.map((address, index) => (
            <li key={index} className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => onSelect(address)} className="text-left">
                {address}
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onRemove(address)}>
                Eliminar
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}

export default FavoriteAddresses

