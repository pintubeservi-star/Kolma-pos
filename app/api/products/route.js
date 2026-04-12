import { NextResponse } from 'next/server';

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_URL;
  const token = process.env.SHOPIFY_ACCESS_TOKEN;

  const query = `{
    products(first: 250, query: "tag:pos") {
      edges {
        node {
          id
          title
          vendor
          variants(first: 1) {
            edges {
              node {
                id
                price
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    const products = data.data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      vendor: node.vendor,
      variantId: node.variants.edges[0].node.id,
      price: node.variants.edges[0].node.price,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
