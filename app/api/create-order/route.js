import { NextResponse } from 'next/server';

export async function POST(request) {
  const domain = process.env.SHOPIFY_STORE_URL;
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  const { line_items } = await request.json();

  const mutation = `mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder { id name }
      userErrors { message }
    }
  }`;

  const input = {
    lineItems: line_items.map(item => ({
      variantId: item.variant_id,
      quantity: item.quantity
    })),
    tags: ["POS-SALE"]
  };

  try {
    const response = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query: mutation, variables: { input } }),
    });

    const result = await response.json();
    return NextResponse.json({ 
      success: true, 
      orderNumber: result.data.draftOrderCreate.draftOrder.name 
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
