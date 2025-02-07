import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

interface Shipping {
  id: string
  orderNumber: string
  customerName: string
  address: string
  amount: number
  shippingType: "correo" | "moto" | "taller"
}

interface PDFGeneratorProps {
  dailyShippings: Shipping[]
}

export default function PDFGenerator({ dailyShippings }: PDFGeneratorProps) {
  const [selectedShippings, setSelectedShippings] = useState<string[]>([])
  const { toast } = useToast()

  const generatePDF = () => {
    const shippingsToGenerate = dailyShippings.filter((shipping) => selectedShippings.includes(shipping.id))
    // Aquí iría la lógica para generar el PDF con los envíos seleccionados
    console.log("Generando PDF para:", shippingsToGenerate)
    toast({
      title: "Etiquetas Generadas",
      description: `Se han generado las etiquetas para ${shippingsToGenerate.length} envíos.`,
    })
  }

  const toggleShippingSelection = (shippingId: string) => {
    setSelectedShippings((prev) =>
      prev.includes(shippingId) ? prev.filter((id) => id !== shippingId) : [...prev, shippingId],
    )
  }

  const toggleAllShippings = () => {
    if (selectedShippings.length === dailyShippings.length) {
      setSelectedShippings([])
    } else {
      setSelectedShippings(dailyShippings.map((shipping) => shipping.id))
    }
  }

  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Generar PDF de etiquetas</h3>
      {dailyShippings.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedShippings.length === dailyShippings.length}
                    onCheckedChange={toggleAllShippings}
                  />
                </TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Tipo de Envío</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyShippings.map((shipping) => (
                <TableRow key={shipping.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedShippings.includes(shipping.id)}
                      onCheckedChange={() => toggleShippingSelection(shipping.id)}
                    />
                  </TableCell>
                  <TableCell>{shipping.orderNumber}</TableCell>
                  <TableCell>{shipping.customerName}</TableCell>
                  <TableCell>{shipping.address}</TableCell>
                  <TableCell>${shipping.amount}</TableCell>
                  <TableCell>{shipping.shippingType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={generatePDF} disabled={selectedShippings.length === 0}>
            Generar PDF ({selectedShippings.length} seleccionados)
          </Button>
        </>
      ) : (
        <p>No hay envíos disponibles para generar etiquetas.</p>
      )}
    </div>
  )
}

