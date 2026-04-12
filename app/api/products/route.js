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
                inventoryQuantity # Solo disponible con Admin API
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
    const products = data.products.edges.flatMap(({ node }) => 
      node.variants.edges.map(({ node: v }) => ({
        id: v.id,
        name: v.title === "Default Title" ? node.title : `${node.title} - ${v.title}`,
        price: parseFloat(v.price),
        image: node.featuredImage?.url || "https://via.placeholder.com/150",
        stock: v.inventoryQuantity // Útil para el POS
      }))
    );

    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: "Error de conexión" }, { status: 500 });
  }
        }
