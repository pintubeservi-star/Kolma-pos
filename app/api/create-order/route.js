import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  
  // Lógica para enviar a Shopify Admin API o guardar en tu base de datos
  console.log("Procesando orden:", body.line_items);

  const orderNumber = Math.floor(Math.random() * 9000) + 1000;

  return NextResponse.json({ 
    success: true, 
    orderNumber: orderNumber 
  });
}
