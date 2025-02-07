import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const DatePicker = ({ selectedDate, setSelectedDate }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  const changeDate = (days) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <Button onClick={() => changeDate(-1)} variant="outline" size="icon">
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
      <Button onClick={() => changeDate(1)} variant="outline" size="icon">
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default DatePicker

