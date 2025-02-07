import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const ReportGenerator = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { toast } = useToast()

  const generateReport = () => {
    // Aquí iría la lógica para generar el reporte
    console.log("Generando reporte desde", startDate, "hasta", endDate)
    toast({
      title: "Reporte Generado",
      description: `Se ha generado el reporte desde ${startDate} hasta ${endDate}.`,
    })
  }

  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Generar reporte</h3>
      <div className="flex items-center gap-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Fecha inicial"
        />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Fecha final" />
        <Button onClick={generateReport} disabled={!startDate || !endDate}>
          Generar reporte
        </Button>
      </div>
    </div>
  )
}

export default ReportGenerator

