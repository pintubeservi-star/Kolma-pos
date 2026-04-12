import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Aquí conectarías con Shopify Storefront API
    // Por ahora, devolvemos un ejemplo para que el POS no cargue infinito
    const products = [
      { id: "1", title: "Queso de Freír", price: "250", vendor: "Lácteos RD", variantId: "v1" },
      { id: "2", title: "Salami Super Especial", price: "180", vendor: "Embutidos", variantId: "v2" }
    ];

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Error cargando productos" }, { status: 500 });
  }
}
