"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const ShippingForm = ({ initialData, onSubmit, onCancel, favoriteAddresses, selectedDate }) => {
  const [formData, setFormData] = useState({
    id: 0,
    numero: "s/n",
    nombre: "",
    direccion: "",
    numeracion: "",
    localidad: "",
    tipoEnvio: "moto",
    costo: 0,
    observaciones: "",
    cod_estado: "A",
    pago: "1",
    fecha: selectedDate.toISOString().split("T")[0],
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    if (name === "favorite") {
      const selectedFavorite = favoriteAddresses.find((fav) => fav.nombre === value)
      if (selectedFavorite) {
        setFormData((prevState) => ({
          ...prevState,
          nombre: selectedFavorite.nombre,
          direccion: selectedFavorite.direccion,
          numeracion: selectedFavorite.numeracion,
          localidad: selectedFavorite.localidad,
        }))
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="numero" value={formData.numero} onChange={handleChange} placeholder="Número de orden" required />
      <Select value={formData.nombre} onValueChange={(value) => handleSelectChange("favorite", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar dirección favorita" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Nueva dirección</SelectItem>
          {favoriteAddresses.map((favorite, index) => (
            <SelectItem key={index} value={favorite.nombre}>
              {favorite.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del cliente" required />
      <Input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" required />
      <Input name="numeracion" value={formData.numeracion} onChange={handleChange} placeholder="Numeración" required />
      <Input name="localidad" value={formData.localidad} onChange={handleChange} placeholder="Localidad" required />
      <Input name="costo" value={formData.costo} onChange={handleChange} placeholder="Costo" type="number" required />
      <Select value={formData.tipoEnvio} onValueChange={(value) => handleSelectChange("tipoEnvio", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Tipo de envío" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="correo">Correo</SelectItem>
          <SelectItem value="moto">Moto</SelectItem>
          <SelectItem value="taller">Taller</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        name="observaciones"
        value={formData.observaciones}
        onChange={handleChange}
        placeholder="Observaciones"
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="pago"
          checked={formData.pago === "1"}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, pago: checked ? "1" : "0" }))}
        />
        <label htmlFor="pago">Pago</label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Agregar"} envío</Button>
      </div>
    </form>
  )
}

export default ShippingForm

