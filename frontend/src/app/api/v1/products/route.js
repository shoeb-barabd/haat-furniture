import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'app', 'products_128_data.json');

async function getProductsFromFile() {
  try {
    const fileContent = await readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Error reading products file:", err);
    return [];
  }
}

async function saveProductsToFile(products) {
  try {
    await writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing products file:", err);
    return false;
  }
}

// 1. GET ALL PRODUCTS (FOR FRONTEND & ADMIN)
export async function GET() {
  const products = await getProductsFromFile();
  return NextResponse.json({ success: true, count: products.length, data: products });
}

// 2. POST ADD NEW PRODUCT (FROM ADMIN PANEL TO FRONTEND)
export async function POST(request) {
  try {
    const newProductData = await request.json();
    const products = await getProductsFromFile();

    const newProd = {
      id: newProductData.id || Date.now(),
      name: newProductData.name,
      price: Number(newProductData.price),
      oldPrice: newProductData.oldPrice ? Number(newProductData.oldPrice) : null,
      categories: newProductData.categories || [newProductData.category_slug || 'home-furniture'],
      category_names: newProductData.category_names || [newProductData.category || 'Home Furniture'],
      image: newProductData.image || "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
      gallery: newProductData.gallery || [newProductData.image],
      wood_type: newProductData.wood_type || "100% Solid Chittagong Teak Wood",
      warranty: "20 Years Guarantee",
      description: newProductData.description || "Solid Chittagong Segun Teak Wood."
    };

    products.unshift(newProd); // Add to top of storefront!
    await saveProductsToFile(products);

    return NextResponse.json({ success: true, message: "Product published to storefront!", data: newProd });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// 3. PUT EDIT PRODUCT (UPDATES STOREFRONT INSTANTLY)
export async function PUT(request) {
  try {
    const updatedData = await request.json();
    let products = await getProductsFromFile();

    const targetId = String(updatedData.id);
    let itemFound = false;

    products = products.map(p => {
      if (String(p.id) === targetId) {
        itemFound = true;
        return {
          ...p,
          name: updatedData.name || p.name,
          price: updatedData.price ? Number(updatedData.price) : p.price,
          oldPrice: updatedData.oldPrice !== undefined ? (updatedData.oldPrice ? Number(updatedData.oldPrice) : null) : p.oldPrice,
          image: updatedData.image || p.image,
          gallery: updatedData.gallery && updatedData.gallery.length > 0 ? updatedData.gallery : p.gallery,
          description: updatedData.description || p.description
        };
      }
      return p;
    });

    if (!itemFound) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    await saveProductsToFile(products);
    return NextResponse.json({ success: true, message: "Storefront updated live!", data: updatedData });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// 4. DELETE PRODUCT FROM STOREFRONT
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing product ID" }, { status: 400 });
    }

    let products = await getProductsFromFile();
    products = products.filter(p => String(p.id) !== String(id));
    await saveProductsToFile(products);

    return NextResponse.json({ success: true, message: "Product deleted from storefront!" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
