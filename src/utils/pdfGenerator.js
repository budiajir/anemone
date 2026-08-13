import { formatPrice } from '../data/products';

/**
 * Generate identical Order Form HTML print document for Web & Admin
 */
export function generateOrderFormPdfHtml(order) {
  const orderNo = order.id || order.orderNo || `ANM-${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Format Date
  const dateStr = order.date || new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Extract customer info
  const customerName = order.customer?.fullName || order.customer || 'Pelanggan Anemone';
  const customerPhone = order.customer?.phone || order.details?.customer?.phone || '+62 813-2266-3825';
  const customerAddress = order.customer?.address || order.details?.customer?.address || 'Jl. Pagermaneuh No.31, Pagerwangi, Lembang, Bandung Barat';

  // Format Items
  let itemsList = [];
  if (Array.isArray(order.details?.items)) {
    itemsList = order.details.items.map((item) => {
      const name = item.name || item.product?.name || 'Climbing Hold';
      const variantsText = item.selectedVariants
        ? Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
        : '';
      const fullName = name + (variantsText ? ` (${variantsText})` : '');
      const price = item.price || item.product?.price || 0;
      const qty = item.quantity || 1;
      return {
        name: fullName,
        quantity: qty,
        price,
        total: price * qty,
      };
    });
  } else if (order.items) {
    itemsList = [
      {
        name: order.items,
        quantity: 1,
        price: order.total || 0,
        total: order.total || 0,
      },
    ];
  } else {
    itemsList = [
      {
        name: 'Anemone Climbing Gear',
        quantity: 1,
        price: order.total || 0,
        total: order.total || 0,
      },
    ];
  }

  const formattedTotal = formatPrice(order.total || itemsList.reduce((sum, i) => sum + i.total, 0));

  const rowsHtml = itemsList
    .map(
      (item) => `
      <tr class="table-row">
        <td style="text-align: center; padding: 14px 12px; border-right: 1px solid #000; font-weight: 500;">${item.quantity}</td>
        <td style="text-align: left; padding: 14px 12px; border-right: 1px solid #000;">
          <div style="font-weight: 600; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px;">${item.name}</div>
        </td>
        <td style="text-align: right; padding: 14px 12px; border-right: 1px solid #000; font-weight: 500; font-family: monospace;">${formatPrice(item.price)}</td>
        <td style="text-align: right; padding: 14px 12px; font-weight: 700; font-family: monospace;">${formatPrice(item.total)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Form - ${orderNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 60px 50px; 
            color: #000; 
            background: #fff; 
            font-size: 14px;
            line-height: 1.5;
          }
          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 60px;
          }
          .logo-block {
            background: #000;
            color: #fff;
            padding: 16px 28px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .logo-text {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-family: 'Inter', sans-serif;
          }
          .title-text {
            font-size: 40px;
            font-weight: 400;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-family: 'Inter', sans-serif;
          }
          .meta-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            gap: 40px;
          }
          .meta-left {
            flex: 1;
            max-width: 450px;
          }
          .meta-right {
            text-align: right;
            min-width: 200px;
          }
          .meta-label {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 400;
          }
          .meta-value-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 6px;
          }
          .meta-value-phone {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 6px;
          }
          .meta-value-address {
            font-size: 13px;
            color: #555;
            line-height: 1.5;
            font-weight: 400;
          }
          .meta-value-right {
            font-size: 14px;
            margin-bottom: 6px;
          }
          
          /* Order Table */
          .order-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
            border: 1px solid #000;
          }
          .order-table th {
            background: #1a1a1a;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 12px;
            border: none;
          }
          .order-table td {
            vertical-align: middle;
          }
          .table-row {
            border-bottom: 1px solid #000;
          }
          .order-table tr:last-child {
            border-bottom: 1px solid #000;
          }
          
          /* Summary */
          .summary-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
          }
          .summary-table {
            min-width: 320px;
            border-collapse: collapse;
          }
          .summary-table td {
            padding: 8px 12px;
            text-align: right;
          }
          .summary-label {
            font-size: 13px;
            font-weight: 700;
            color: #444;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .summary-value {
            font-size: 15px;
            font-weight: 850;
            color: #000;
            font-family: monospace;
          }
          .summary-total-row {
            border-top: 1px solid #e0e0e0;
          }
          
          @media print {
            body { padding: 40px 20px; }
            @page { margin: 20mm; }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="logo-block">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5C52.7614 5 55 25.1472 55 50C55 74.8528 52.7614 95 50 95C47.2386 95 45 74.8528 45 50C45 25.1472 47.2386 5 50 5Z" fill="#FFF"/>
              <path d="M95 50C95 52.7614 74.8528 55 50 55C25.1472 55 5 52.7614 5 45C5 47.2386 25.1472 45 50 45C74.8528 45 95 47.2386 95 50Z" fill="#FFF"/>
              <path d="M81.8198 18.1802C83.7724 20.1328 68.0416 34.6274 50.5 50.5C32.9584 66.3726 16.2276 79.8672 14.275 77.9146C12.3224 75.962 25.817 59.2542 43.3585 43.3817C60.9001 27.5091 79.8672 16.2276 81.8198 18.1802Z" fill="#FFF"/>
              <path d="M14.275 18.1802C12.3224 20.1328 27.817 34.6274 45.3585 50.5C62.9001 66.3726 79.6309 79.8672 81.5835 77.9146C83.5361 75.962 70.0416 59.2542 52.5 43.3817C34.9584 27.5091 16.2276 16.2276 14.275 18.1802Z" fill="#FFF"/>
            </svg>
            <span class="logo-text">ANEMONE</span>
          </div>
          <div class="title-text">ORDER FORM</div>
        </div>
        
        <div class="meta-container">
          <div class="meta-left">
            <div class="meta-label">Order form by:</div>
            <div class="meta-value-name">${customerName}</div>
            <div class="meta-value-phone">${customerPhone}</div>
            <div class="meta-value-address">${customerAddress}</div>
          </div>
          
          <div class="meta-right">
            <div class="meta-value-right" style="font-weight: 700; font-size: 15px;">Order Form No. ${orderNo}</div>
            <div class="meta-value-right" style="color: #666; font-[500];">Date: ${dateStr}</div>
            <div class="meta-value-right" style="margin-top: 6px;">
              <span style="display: inline-block; background: #000; color: #fff; padding: 3px 10px; border-radius: 4px; font-weight: 700; font-size: 11px; text-transform: uppercase;">
                ${order.status || 'Processing'}
              </span>
            </div>
          </div>
        </div>

        <table class="order-table">
          <thead>
            <tr>
              <th style="width: 10%; text-align: center;">QTY</th>
              <th style="width: 55%; text-align: left;">ITEM DESCRIPTION</th>
              <th style="width: 17.5%; text-align: right;">PRICE</th>
              <th style="width: 17.5%; text-align: right;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="summary-container">
          <table class="summary-table">
            <tr class="summary-total-row">
              <td class="summary-label" style="font-size: 14px; padding-top: 14px;">TOTAL AMOUNT</td>
              <td class="summary-value" style="font-size: 20px; font-weight: 900; padding-top: 14px;">${formattedTotal}</td>
            </tr>
          </table>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
}

/**
 * Generate official Anemone Product Catalog PDF print document
 */
export function generateProductCatalogPdfHtml(productsList = []) {
  const catalogDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const catalogItems = productsList.length > 0 ? productsList : [
    { name: 'Anemone Crimp Set Alpha', category: 'Holds', material: 'PU', price: 485000 },
    { name: 'Reef Jug Set', category: 'Holds', material: 'PU', price: 620000 },
    { name: 'Tidal Wave Fiberglass Macro', category: 'Macros', material: 'Fiberglass', price: 1480000 },
    { name: 'Geometric Plywood Volume - Tetrahedron', category: 'Volumes', material: 'Plywood', price: 1650000 },
    { name: 'Full Ecosystem Set', category: 'Smart Wall Kit', material: 'PU & LED', price: 8900000 },
    { name: 'Pro Holds Bundle', category: 'Smart Wall Kit', material: 'PU', price: 5800000 },
    { name: 'Essential LED Kit', category: 'Smart Wall Kit', material: 'LED Controller', price: 3500000 },
  ];

  const itemsHtml = catalogItems.map((prod, idx) => `
    <div style="border: 1px solid #111; padding: 18px; border-radius: 4px; background: #fafafa; display: flex; justify-content: space-between; items-center; margin-bottom: 12px; page-break-inside: avoid;">
      <div>
        <div style="font-size: 10px; font-weight: 800; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 4px;">
          ${prod.category || 'GEAR'} &bull; ${prod.material || 'VIRGIN PU'}
        </div>
        <div style="font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #000;">
          ${prod.name}
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">
          ${prod.shortDescription || prod.description || '100% Virgin Polyurethane & Baltic Birch Plywood Specs'}
        </div>
      </div>
      <div style="text-align: right; shrink: 0; padding-left: 20px;">
        <div style="font-size: 16px; font-weight: 900; font-family: monospace; color: #000;">
          ${formatPrice(prod.price)}
        </div>
        <div style="font-size: 9px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">
          IN STOCK &bull; IFSC SPEC
        </div>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Anemone Product Catalog 2026</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 40px; 
            color: #000; 
            background: #fff; 
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 4px;
            text-transform: uppercase;
          }
          .catalog-meta {
            text-align: right;
            font-size: 12px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .specs-banner {
            background: #000;
            color: #fff;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            text-align: center;
          }
          .spec-item div:first-child {
            font-size: 18px;
            font-weight: 900;
            font-family: monospace;
          }
          .spec-item div:last-child {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: #aaa;
            margin-top: 4px;
          }
          @media print {
            body { padding: 20px; }
            @page { margin: 15mm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">&bull; ANEMONE</div>
            <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #555; margin-top: 4px;">
              OFFICIAL PRODUCT CATALOG &amp; SPECIFICATIONS
            </div>
          </div>
          <div class="catalog-meta">
            <div style="font-weight: 800; color: #000;">EDITION 2026 // RELEASE 4.0</div>
            <div>VALID UNTIL: ${catalogDate}</div>
          </div>
        </div>

        <div class="specs-banner">
          <div class="spec-item">
            <div>100%</div>
            <div>VIRGIN PU &amp; BIRCH</div>
          </div>
          <div class="spec-item">
            <div>&lt; 10ms</div>
            <div>SMART WALL LATENCY</div>
          </div>
          <div class="spec-item">
            <div>0.01mm</div>
            <div>CNC TOLERANCE</div>
          </div>
          <div class="spec-item">
            <div>IFSC</div>
            <div>COMPETITION GRADE</div>
          </div>
        </div>

        <div style="font-size: 11px; font-weight: 800; font-family: monospace; letter-spacing: 2px; text-transform: uppercase; color: #444; margin-bottom: 15px;">
          PRODUCTS &amp; HARDWARE INVENTORY (${catalogItems.length} ITEMS)
        </div>

        ${itemsHtml}

        <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px;">
          <div>Anemone Hardware &amp; Smart Wall Technologies</div>
          <div>www.anemoneclimbing.com &bull; +62 813-2266-3825</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;
}

