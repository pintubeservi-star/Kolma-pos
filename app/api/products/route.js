import { NextResponse } from "next/server";

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const publicToken = "A171ee1eaf68d9b7ca5234b4c45a9b0c"; 

  const query = `{
    products(first: 100) {
      edges {
        node {
          title
          featuredImage { url }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price { amount }
              }
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch(`https://${domain}/api/2024-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": publicToken,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await res.json();
    
    // Desglosar cada variante como un producto individual
    const products = data.products.edges.flatMap(({ node }) => 
      node.variants.edges.map(({ node: v }) => ({
        id: v.id,
        name: v.title === "Default Title" ? node.title : `${node.title} (${v.title})`,
        price: parseFloat(v.price.amount),
        image: node.featuredImage?.url || "https://via.placeholder.com/150"
      }))
    );

    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: "Fallo de conexión" }, { status: 500 });
  }
}
