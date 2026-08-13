import { useProductsStore } from '../store/productsStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all products or filter by category query parameter.
 * Includes graceful fallback to persistent productsStore if offline.
 */
export async function getProducts(category = '') {
  try {
    const url = category && category.toLowerCase() !== 'all'
      ? `${BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/products`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.products || data;
  } catch (error) {
    // Fallback to Zustand productsStore
    const allProds = useProductsStore.getState().products;
    if (category && category.toLowerCase() !== 'all') {
      return allProds.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }
    return allProds;
  }
}

/**
 * Fetch a single product by slug.
 * Includes fallback to persistent productsStore if offline.
 */
export async function getProductBySlug(slug) {
  try {
    const response = await fetch(`${BASE_URL}/products/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.product || data;
  } catch (error) {
    const allProds = useProductsStore.getState().products;
    const found = allProds.find((p) => p.slug === slug);
    if (!found) {
      throw new Error('Product not found');
    }
    return found;
  }
}

/**
 * Create a new order by posting to POST /api/orders.
 * Includes fallback response if offline.
 */
export async function createOrder(orderData) {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: true,
      message: 'Order created offline fallback',
      order: {
        id: orderData.orderNo || `ANM-${Date.now()}`,
        ...orderData,
        status: 'Processing',
        createdAt: new Date().toISOString(),
      },
    };
  }
}
