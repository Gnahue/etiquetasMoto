"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2, Search, FileDown } from "lucide-react"
import Modal from "./Modal"
import ShippingForm from "./ShippingForm"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ShippingList = ({ selectedDate, shippings, setShippings }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingShipping, setEditingShipping] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedShippings, setSelectedShippings] = useState([])
  const { toast } = useToast()

  const handleDelete = async (id) => {
    try {
      const response = await axios.post("https://vicortantes.com.ar/etiquetas-pedidos/api.php?action=eliminar_envio", {
        id,
      })
      if (response.data.success) {
        setShippings(shippings.filter((shipping) => shipping.id !== id))
        setSelectedShippings(selectedShippings.filter((selectedId) => selectedId !== id))
        toast({
          title: "Envío eliminado",
          description: response.data.message,
        })
      } else {
        throw new Error(response.data.message || "Error al eliminar el envío")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (shipping) => {
    setEditingShipping(shipping)
    setIsEditModalOpen(true)
  }

  const handleUpdate = async (updatedShipping) => {
    try {
      const response = await axios.post(
        "https://vicortantes.com.ar/etiquetas-pedidos/api.php?action=editar_envio",
        updatedShipping,
      )
      if (response.data.success) {
        setShippings(shippings.map((shipping) => (shipping.id === updatedShipping.id ? updatedShipping : shipping)))
        setIsEditModalOpen(false)
        setEditingShipping(null)
        toast({
          title: "Envío actualizado",
          description: response.data.message,
        })
      } else {
        throw new Error(response.data.message || "Error al actualizar el envío")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredShippings = shippings.filter(
    (shipping) =>
      (filterType === "all" || shipping.tipoEnvio === filterType) &&
      (shipping.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipping.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipping.localidad.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredShippings.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const toggleShippingSelection = (shippingId) => {
    setSelectedShippings((prev) =>
      prev.includes(shippingId) ? prev.filter((id) => id !== shippingId) : [...prev, shippingId],
    )
  }

  const toggleAllShippings = () => {
    if (selectedShippings.length === currentItems.length) {
      setSelectedShippings([])
    } else {
      setSelectedShippings(currentItems.map((shipping) => shipping.id))
    }
  }

  const generatePDF = () => {
    const shippingsToGenerate = shippings.filter((shipping) => selectedShippings.includes(shipping.id))
    // Aquí iría la lógica para generar el PDF con los envíos seleccionados
    console.log("Generando PDF para:", shippingsToGenerate)
    toast({
      title: "PDF Generado",
      description: `Se ha generado el PDF para ${shippingsToGenerate.length} envíos.`,
    })
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Envíos del día</h3>
        <Button onClick={generatePDF} disabled={selectedShippings.length === 0}>
          <FileDown className="mr-2 h-4 w-4" />
          Generar PDF ({selectedShippings.length})
        </Button>
      </div>
      <div className="flex space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por orden, cliente o localidad"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="correo">Correo</SelectItem>
            <SelectItem value="moto">Moto</SelectItem>
            <SelectItem value="taller">Taller</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedShippings.length === currentItems.length && currentItems.length > 0}
                onCheckedChange={toggleAllShippings}
              />
            </TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Localidad</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Tipo de Envío</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Observaciones</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((shipping) => (
            <TableRow key={shipping.id}>
              <TableCell>
                <Checkbox
                  checked={selectedShippings.includes(shipping.id)}
                  onCheckedChange={() => toggleShippingSelection(shipping.id)}
                />
              </TableCell>
              <TableCell>{shipping.numero}</TableCell>
              <TableCell>{shipping.nombre}</TableCell>
              <TableCell>
                {shipping.direccion} {shipping.numeracion}
              </TableCell>
              <TableCell>{shipping.localidad}</TableCell>
              <TableCell>${shipping.costo}</TableCell>
              <TableCell>{shipping.tipoEnvio}</TableCell>
              <TableCell>{shipping.pago === "1" ? "Sí" : "No"}</TableCell>
              <TableCell>{shipping.observaciones}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(shipping)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el envío.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(shipping.id)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: Math.ceil(filteredShippings.length / itemsPerPage) }, (_, i) => (
          <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => paginate(i + 1)}>
            {i + 1}
          </Button>
        ))}
      </div>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingShipping(null)
        }}
        title="Editar Envío"
      >
        {editingShipping && (
          <ShippingForm
            initialData={editingShipping}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  )
}

export default ShippingList

