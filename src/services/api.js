import { useProductsStore } from '../store/productsStore';
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Helper to fetch data trying anemone_products first, then products.
 */
async function fetchProductsFromSupabase(category = '') {
  // Try anemone_products first
  let query1 = supabase.from('anemone_products').select('*');
  if (category && category.toLowerCase() !== 'all') {
    query1 = query1.ilike('category', category);
  }
  const res1 = await query1;
  if (!res1.error && res1.data && res1.data.length > 0) {
    return res1.data;
  }

  // Fallback to products
  let query2 = supabase.from('products').select('*');
  if (category && category.toLowerCase() !== 'all') {
    query2 = query2.ilike('category', category);
  }
  const res2 = await query2;
  if (!res2.error && res2.data && res2.data.length > 0) {
    return res2.data;
  }

  return null;
}

export async function getProducts(category = '') {
  if (isSupabaseConfigured && supabase) {
    try {
      const data = await fetchProductsFromSupabase(category);
      if (data) return data;
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

export async function getProductBySlug(slug) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Try anemone_products first
      const res1 = await supabase
        .from('anemone_products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!res1.error && res1.data) return res1.data;

      // Fallback to products
      const res2 = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!res2.error && res2.data) return res2.data;
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

export async function createOrder(orderData) {
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        order_no: orderData.orderNo || `ANM-${Date.now()}`,
        customer: orderData.customer,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shippingCost,
        total: orderData.total,
        status: 'Processing',
        created_at: new Date().toISOString()
      };

      // Try anemone_orders first
      const res1 = await supabase.from('anemone_orders').insert([payload]).select();
      if (!res1.error && res1.data) return { success: true, order: res1.data[0] };

      // Fallback to orders
      const res2 = await supabase.from('orders').insert([payload]).select();
      if (!res2.error && res2.data) return { success: true, order: res2.data[0] };
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
