import { useProductsStore } from '../store/productsStore';
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Fetch all products or filter by category query parameter.
 * Uses Supabase if configured, otherwise falls back to persistent productsStore.
 */
export async function getProducts(category = '') {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('products').select('*');
      if (category && category.toLowerCase() !== 'all') {
        query = query.ilike('category', category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch error, fallback to local store:', err);
    }
  }

  // Fallback to Zustand productsStore
  const allProds = useProductsStore.getState().products;
  if (category && category.toLowerCase() !== 'all') {
    return (allProds || []).filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }
  return allProds;
}

/**
 * Fetch a single product by slug.
 * Uses Supabase if configured, otherwise falls back to persistent productsStore.
 */
export async function getProductBySlug(slug) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase product fetch error, fallback to local store:', err);
    }
  }

  const allProds = useProductsStore.getState().products;
  const found = (allProds || []).find((p) => p.slug === slug);
  if (!found) {
    throw new Error('Product not found');
  }
  return found;
}

/**
 * Create a new order.
 * Saves to Supabase orders table if configured.
 */
export async function createOrder(orderData) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_no: orderData.orderNo || `ANM-${Date.now()}`,
          customer: orderData.customer,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shippingCost,
          total: orderData.total,
          status: 'Processing',
          created_at: new Date().toISOString()
        }])
        .select();

      if (!error && data) {
        return { success: true, order: data[0] };
      }
    } catch (err) {
      console.warn('Supabase order creation error:', err);
    }
  }

  return {
    success: true,
    message: 'Order created locally',
    order: {
      id: orderData.orderNo || `ANM-${Date.now()}`,
      ...orderData,
      status: 'Processing',
      createdAt: new Date().toISOString(),
    },
  };
}
