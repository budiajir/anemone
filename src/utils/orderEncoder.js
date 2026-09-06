/**
 * Safely encode and decode order data into URL parameters so that
 * digital order forms/invoices work seamlessly across all devices,
 * browsers, WhatsApp links, and sessions without requiring a central database.
 */

export function encodeOrderData(order) {
  try {
    if (!order) return "";
    const items = order.items || order.details?.items || order.rawItems || [];
    
    const compact = {
      id: order.orderNo || order.id || "",
      n: order.customer?.fullName || order.name || order.customer || "",
      p: order.customer?.phone || order.phone || "",
      a: order.customer?.address || order.address || "",
      d: order.date || "",
      t: order.total || 0,
      i: items.map((item) => {
        let variantsText = "";
        if (item.selectedVariants && typeof item.selectedVariants === "object") {
          variantsText = Object.entries(item.selectedVariants)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
        } else if (typeof item.variantsText === "string") {
          variantsText = item.variantsText;
        } else if (typeof item.variants === "string") {
          variantsText = item.variants;
        }

        return {
          n: item.name || item.product?.name || "Climbing Product",
          q: item.quantity || 1,
          p: item.price || item.product?.price || 0,
          v: variantsText,
        };
      }),
    };

    const jsonStr = JSON.stringify(compact);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Base64 URL safe
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (e) {
    console.error("Error encoding order data:", e);
    return "";
  }
}

export function decodeOrderData(encoded) {
  try {
    if (!encoded) return null;
    // Revert URL safe Base64
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const compact = JSON.parse(jsonStr);

    const items = (compact.i || []).map((item) => {
      const formattedName = item.n + (item.v ? ` (${item.v})` : "");
      return {
        name: formattedName,
        rawName: item.n,
        quantity: item.q || 1,
        price: item.p || 0,
        total: (item.p || 0) * (item.q || 1),
        variantsText: item.v || "",
      };
    });

    const calculatedTotal = compact.t || items.reduce((sum, item) => sum + item.total, 0);

    return {
      id: compact.id,
      orderNo: compact.id,
      customer: {
        fullName: compact.n,
        phone: compact.p,
        address: compact.a,
      },
      name: compact.n,
      phone: compact.p,
      address: compact.a,
      date: compact.d,
      total: calculatedTotal,
      status: "PROCESSING",
      items: items,
      rawItems: items,
    };
  } catch (e) {
    console.error("Error decoding order data:", e);
    return null;
  }
}
