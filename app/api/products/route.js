import { NextResponse } from "next/server";

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  const query = `{
    products(first: 50) {
      edges {
        node {
          title
          featuredImage { url }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await res.json();
    
    // Esto separa cada variante como un ítem individual
    const products = data.products.edges.flatMap(({ node }) => 
      node.variants.edges.map(({ node: variant }) => ({
        id: variant.id,
        // Si la variante no tiene nombre especial, usa el del producto
        name: variant.title === "Default Title" ? node.title : `${node.title} (${variant.title})`,
        price: parseFloat(variant.price),
        image: node.featuredImage?.url || "https://via.placeholder.com/150",
      }))
    );

    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: "Error en Shopify" }, { status: 500 });
  }
}
