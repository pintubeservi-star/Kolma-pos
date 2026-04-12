import { NextResponse } from 'next/server';

export async function GET() {
  // Estos leerán los valores secretos que pusiste en Vercel
  const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
  const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

  const query = `{
    products(first: 50) {
      edges {
        node {
          id
          title
          featuredImage { url }
          variants(first: 1) {
            edges {
              node {
                price
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    const products = data.products.edges.map(edge => ({
      id: edge.node.id,
      name: edge.node.title,
      price: parseFloat(edge.node.variants.edges[0].node.price),
      image: edge.node.featuredImage?.url || 'https://via.placeholder.com/150',
    }));

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error cargando productos' }, { status: 500 });
  }
}
