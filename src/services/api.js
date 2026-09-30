import { useProductsStore } from '../store/productsStore';
import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Normalizes product from Supabase to ensure uniform property names
 * and complete specs for climbing holds and macros.
 */
export function normalizeProduct(p) {
  if (!p) return p;
  const desc = (p.short_description || p.shortDescription || p.description || '').toLowerCase();
  const cat = (p.category || '').toLowerCase();
  const isHoldLike = ['holds', 'macros', 'volumes'].includes(cat);

  const finalImages = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : (p.image ? [p.image] : ['/images/crimps.jpg']);

  let defaultType = 'Mini Jug & Crimp';
  if (desc.includes('pinch')) defaultType = 'Pinch';
  else if (desc.includes('sloper')) defaultType = 'Sloper & Jug';
  else if (desc.includes('crimp')) defaultType = 'Crimp';
  else if (desc.includes('jug')) defaultType = 'Mini Jug & Crimp';
  else if (desc.includes('pocket')) defaultType = 'Pocket';
  else if (cat === 'macros') defaultType = 'Pinch';

  let defaultDiff = 'Medium - Hard';
  if (desc.includes('easy - medium') || desc.includes('easy-medium')) defaultDiff = 'Easy - Medium';
  else if (desc.includes('medium - hard') || desc.includes('medium-hard')) defaultDiff = 'Medium - Hard';
  else if (desc.includes('medium')) defaultDiff = 'Medium';
  else if (desc.includes('easy')) defaultDiff = 'Easy';
  else if (desc.includes('hard')) defaultDiff = 'Hard';

  const defaultBolt = cat === 'macros' ? 'Screw-on' : 'M10 Allen';

  const qtyMatch = desc.match(/(\d+)\s*(pcs|buah|set)/i);
  const defaultQty = qtyMatch ? `${qtyMatch[1]} Pcs` : (cat === 'macros' ? '7 Pcs' : '1 Set');

  return {
    ...p,
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    material: p.material || (cat === 'macros' ? 'Fiberglass' : 'PU'),
    price: Number(p.price) || 0,
    stock: p.stock !== undefined ? Number(p.stock) : 20,
    description: p.description || '',
    shortDescription: p.shortDescription || p.short_description || p.description || '',
    short_description: p.short_description || p.shortDescription || p.description || '',
    images: finalImages,
    image: finalImages[0],
    variants: p.variants || [],
    isNew: p.isNew !== undefined ? p.isNew : (p.is_new !== undefined ? p.is_new : false),
    isFeatured: p.isFeatured !== undefined ? p.isFeatured : (p.is_featured !== undefined ? p.is_featured : false),
    specs: p.specs || (isHoldLike ? {
      quantity: defaultQty,
      type: defaultType,
      difficulty: defaultDiff,
      boltType: defaultBolt,
      material: p.material || (cat === 'macros' ? 'Fiberglass' : 'PU'),
    } : {}),
  };
}

/**
 * Fetch products from Supabase trying anemone_products first, then products.
 */
async function fetchProductsFromSupabase(category = '') {
  let query = supabase.from('anemone_products').select('*').order('id', { ascending: true });
  if (category && category.toLowerCase() !== 'all') {
    query = query.ilike('category', category);
  }
  const res = await query;
  if (!res.error && res.data && res.data.length > 0) {
    return res.data.map(normalizeProduct);
  }

  // Fallback to legacy products table if exists
  let query2 = supabase.from('products').select('*');
  if (category && category.toLowerCase() !== 'all') {
    query2 = query2.ilike('category', category);
  }
  const res2 = await query2;
  if (!res2.error && res2.data && res2.data.length > 0) {
    return res2.data.map(normalizeProduct);
  }

  return null;
}

export async function getProducts(category = '') {
  if (isSupabaseConfigured && supabase) {
    try {
      const data = await fetchProductsFromSupabase(category);
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch error, fallback to local store:', err);
    }
  }

  // Fallback to Zustand productsStore
  const allProds = useProductsStore.getState().products || [];
  const normalized = allProds.map(normalizeProduct);
  if (category && category.toLowerCase() !== 'all') {
    return normalized.filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }
  return normalized;
}

export async function getProductBySlug(slug) {
  if (isSupabaseConfigured && supabase) {
    try {
      const res = await supabase
        .from('anemone_products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!res.error && res.data) {
        return normalizeProduct(res.data);
      }

      // Fallback to legacy products table
      const res2 = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!res2.error && res2.data) {
        return normalizeProduct(res2.data);
      }
    } catch (err) {
      console.warn('Supabase product fetch error, fallback to local store:', err);
    }
  }

  const allProds = useProductsStore.getState().products || [];
  const found = allProds.find((p) => p.slug === slug);
  if (!found) {
    throw new Error('Product not found');
  }
  return normalizeProduct(found);
}

/**
 * Upsert product both to Zustand store and to Supabase cloud database
 */
export async function upsertProduct(productData) {
  // 1. Immediately update Zustand store for instant UI response
  const store = useProductsStore.getState();
  const existing = (store.products || []).find(
    (p) => (productData.id && p.id === productData.id) || p.slug === productData.slug
  );

  if (existing) {
    store.updateProduct(existing.id, productData);
  } else {
    store.addProduct(productData);
  }

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        name: productData.name,
        slug: productData.slug,
        category: productData.category,
        material: productData.material,
        price: Number(productData.price) || 0,
        stock: productData.stock !== undefined ? Number(productData.stock) : 20,
        description: productData.description || '',
        short_description: productData.shortDescription || productData.short_description || productData.description || '',
        image: (productData.images && productData.images[0]) || productData.image || '/images/crimps.jpg',
        images: productData.images || [productData.image || '/images/crimps.jpg'],
        variants: productData.variants || [],
        is_new: productData.isNew !== undefined ? productData.isNew : true,
        is_featured: productData.isFeatured !== undefined ? productData.isFeatured : false,
      };

      // Check if product exists in Supabase by slug
      const { data: existingRow } = await supabase
        .from('anemone_products')
        .select('id')
        .eq('slug', productData.slug)
        .maybeSingle();

      if (existingRow) {
        const { data, error } = await supabase
          .from('anemone_products')
          .update(payload)
          .eq('id', existingRow.id)
          .select();

        if (!error && data && data[0]) {
          return { success: true, product: normalizeProduct(data[0]) };
        }
      } else {
        const { data, error } = await supabase
          .from('anemone_products')
          .insert([payload])
          .select();

        if (!error && data && data[0]) {
          return { success: true, product: normalizeProduct(data[0]) };
        }
      }
    } catch (err) {
      console.warn('Error saving product to Supabase:', err);
    }
  }

  return { success: true, product: normalizeProduct(productData) };
}

/**
 * Delete product from both Zustand store and Supabase
 */
export async function deleteProductFromDB(id, slug) {
  const store = useProductsStore.getState();
  if (id) store.deleteProduct(id);

  if (isSupabaseConfigured && supabase) {
    try {
      if (slug) {
        await supabase.from('anemone_products').delete().eq('slug', slug);
      } else if (id) {
        await supabase.from('anemone_products').delete().eq('id', id);
      }
    } catch (err) {
      console.warn('Error deleting product from Supabase:', err);
    }
  }
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
