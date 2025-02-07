import { NextResponse } from "next/server"

export async function GET() {
  // En una implementación real, esto obtendría datos de la tienda online
  const mockOrders = [
    { id: "1", orderNumber: "001", customerName: "Ana López", address: "Calle Principal 123, Ciudad", amount: 1200 },
    { id: "2", orderNumber: "002", customerName: "Pedro Gómez", address: "Avenida Central 456, Pueblo", amount: 1800 },
    { id: "3", orderNumber: "003", customerName: "Laura Martínez", address: "Plaza Mayor 789, Villa", amount: 2200 },
    {
      id: "4",
      orderNumber: "004",
      customerName: "Carlos Rodríguez",
      address: "Calle Secundaria 321, Aldea",
      amount: 1500,
    },
    {
      id: "5",
      orderNumber: "005",
      customerName: "María Sánchez",
      address: "Avenida del Parque 654, Ciudad",
      amount: 1900,
    },
  ]

  return NextResponse.json(mockOrders)
}

