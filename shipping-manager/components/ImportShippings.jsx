import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import Modal from "./Modal"
import { useToast } from "@/components/ui/use-toast"

const ImportShippings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [selectedOrders, setSelectedOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const { toast } = useToast()

  const fetchOrders = async () => {
    const response = await fetch("/api/orders")
    const data = await response.json()
    setOrders(data)
    setIsModalOpen(true)
  }

  const importSelected = async () => {
    const ordersToImport = orders.filter((order) => selectedOrders.includes(order.id))
    const response = await fetch("/api/shippings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ordersToImport),
    })
    const result = await response.json()
    if (result.success) {
      toast({
        title: "Éxito",
        description: "Pedidos importados correctamente",
      })
      setOrders(orders.filter((order) => !selectedOrders.includes(order.id)))
      setSelectedOrders([])
      setIsModalOpen(false)
    } else {
      toast({
        title: "Error",
        description: "Error al importar pedidos",
        variant: "destructive",
      })
    }
  }

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div>
      <Button onClick={fetchOrders}>Importar Etiquetas</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Importar Etiquetas">
        {orders.length > 0 ? (
          <div className="space-y-4">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Seleccionar</TableHead>
                    <TableHead>Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Tipo de Envío</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => toggleOrderSelection(order.id)}
                        />
                      </TableCell>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>${order.amount}</TableCell>
                      <TableCell>{order.shippingType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }, (_, i) => (
                <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button onClick={importSelected} disabled={selectedOrders.length === 0}>
              Importar Seleccionados ({selectedOrders.length})
            </Button>
          </div>
        ) : (
          <p>No hay pedidos disponibles para importar.</p>
        )}
      </Modal>
    </div>
  )
}

export default ImportShippings

