import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { action, payload } = await req.json();
    
    // Vercel lee las variables que configuraste
    const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN;

    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    };

    if (action === 'get_products') {
      const res = await fetch(`https://${DOMAIN}/admin/api/2024-04/products.json?limit=250`, { headers });
      return NextResponse.json(await res.json());
    }

    if (action === 'get_orders') {
      const res = await fetch(`https://${DOMAIN}/admin/api/2024-04/orders.json?limit=50&status=any`, { headers });
      return NextResponse.json(await res.json());
    }

    if (action === 'create_order') {
      const res = await fetch(`https://${DOMAIN}/admin/api/2024-04/orders.json`, { 
        method: 'POST', 
        headers, 
        body: JSON.stringify(payload) 
      });
      return NextResponse.json(await res.json());
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
