import React, { useState, useMemo, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Check, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../../data/products';
import { useProductsStore } from '../../store/productsStore';

export default function AdminProducts() {
  // Subscribe to shared persistent Zustand productsStore
  const productList = useProductsStore((s) => s.products) || [];
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);

  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef(null);

  // Form State with Multiple Images Support
  const [form, setForm] = useState({
    name: '',
    category: 'Holds',
    material: 'PU',
    price: '',
    stock: 25,
    images: ['/images/crimps.jpg'],
    description: ''
  });

  const categories = ['All', 'Holds', 'Macros', 'Volumes', 'Hangboard', 'Bouldering Essentials', 'Smart Wall Kit'];

  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') return productList;
    return productList.filter((p) => p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
  }, [productList, categoryFilter]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Holds',
      material: 'PU',
      price: '',
      stock: 20,
      images: ['/images/crimps.jpg'],
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    const existingImages = product.images && product.images.length > 0
      ? product.images
      : [product.image || '/images/crimps.jpg'];

    setForm({
      name: product.name,
      category: product.category || 'Holds',
      material: product.material || 'PU',
      price: product.price,
      stock: product.stock || 15,
      images: existingImages,
      description: product.shortDescription || product.description || ''
    });
    setIsModalOpen(true);
  };

  // Compress high-resolution images to lightweight JPEG data URLs before saving to localStorage
  const compressImageFile = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.75) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      setNotification('Product deleted successfully');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  // Handle Multiple File Upload from Computer with Automatic Compression
  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const compressionPromises = files.map((file) => compressImageFile(file));
        const compressedResults = await Promise.all(compressionPromises);
        const validImages = compressedResults.filter(Boolean);

        if (validImages.length > 0) {
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...validImages]
          }));
        }
      } catch (err) {
        console.error('Error uploading/compressing images:', err);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const priceNum = Number(form.price) || 0;
    const stockNum = form.stock !== undefined && form.stock !== '' ? Number(form.stock) : 25;

    const finalImages = form.images.length > 0 ? form.images : ['/images/crimps.jpg'];

    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, {
          name: form.name.trim(),
          category: form.category,
          material: form.material || 'PU',
          price: priceNum,
          stock: stockNum,
          images: finalImages,
          image: finalImages[0],
          description: form.description,
          shortDescription: form.description
        });
        setNotification(`Product "${form.name.trim()}" updated successfully!`);
      } else {
        let cleanSlug = form.name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        if (!cleanSlug) cleanSlug = `product-${Date.now()}`;

        // Ensure unique slug
        let finalSlug = cleanSlug;
        let counter = 1;
        while (productList.some((p) => p.slug === finalSlug)) {
          finalSlug = `${cleanSlug}-${counter}`;
          counter++;
        }

        const newProd = {
          id: Date.now() + Math.floor(Math.random() * 10000),
          name: form.name.trim(),
          slug: finalSlug,
          category: form.category,
          material: form.material || 'PU',
          price: priceNum,
          stock: stockNum,
          description: form.description,
          shortDescription: form.description,
          images: finalImages,
          image: finalImages[0],
          variants: [],
          rating: 5.0,
          reviewCount: 1,
          isNew: true,
          isFeatured: false
        };

        addProduct(newProd);

        // Reset category filter to 'all' so new product is immediately visible
        setCategoryFilter('all');
        setNotification(`New product "${newProd.name}" created successfully!`);
      }

      setIsModalOpen(false);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Error submitting product:', err);
      alert('An error occurred while saving the product. Please try again.');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title & Description */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-white">
          PRODUCT CATALOG
        </h1>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-2">
          MANAGE, EDIT, AND UPLOAD MULTIPLE CATALOG PHOTOS ({productList.length} TOTAL PRODUCTS)
        </p>
      </div>

      {/* Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs px-4 py-3 rounded-sm flex items-center justify-between shadow-lg"
          >
            <span>✓ {notification}</span>
            <button onClick={() => setNotification('')} className="text-emerald-400 hover:text-white cursor-pointer">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar: Categories & Add Button (SUPR RECTANGULAR CHIPS) */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat.toLowerCase())}
                className={`px-4 py-2 rounded-sm text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'bg-black border border-white/10 text-neutral-400 hover:text-white hover:border-white/25'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-white text-black font-black uppercase tracking-widest text-xs px-5 py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden space-y-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">IMAGE &amp; NAME</th>
                <th className="px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">PHOTOS COUNT</th>
                <th className="px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">CATEGORY</th>
                <th className="px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">PRICE</th>
                <th className="px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">STOCK</th>
                <th className="px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              <AnimatePresence>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const imgSrc = product.images?.[0] || product.image || '/images/crimps.jpg';
                    const photosCount = product.images?.length || 1;
                    const stockVal = product.stock !== undefined ? product.stock : 24;

                    return (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        key={product.id}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        {/* Image & Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-sm overflow-hidden bg-black border border-white/10 shrink-0">
                              <img src={imgSrc} alt={product.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                            </div>
                            <div>
                              <div className="text-white font-bold text-xs uppercase tracking-wider">
                                {product.name}
                              </div>
                              <div className="text-neutral-500 text-[11px] truncate max-w-[200px] font-light">
                                {product.shortDescription || product.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Photos Count */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[10px] font-bold text-white bg-black border border-white/15 px-2.5 py-1 rounded-sm uppercase tracking-wider">
                            {photosCount} PHOTOS
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-300 bg-black border border-white/10 px-2.5 py-1 rounded-sm">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-black text-white whitespace-nowrap">
                          {formatPrice(product.price)}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span className={`font-mono text-xs font-bold uppercase ${stockVal > 5 ? 'text-neutral-300' : 'text-rose-400'}`}>
                            {stockVal} UNITS
                          </span>
                        </td>

                        {/* Functional Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-2 rounded-sm bg-black border border-white/15 hover:border-white/40 text-neutral-400 hover:text-white transition-all cursor-pointer"
                              title="Edit Product & Photos"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 rounded-sm bg-black border border-white/15 hover:border-rose-400/50 hover:bg-rose-950/30 text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest">
                      NO PRODUCTS FOUND IN THIS CATEGORY.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center font-mono text-[10px] text-neutral-500 uppercase tracking-widest pt-2">
        <span>DISPLAYED: {filteredProducts.length} ITEMS</span>
        <span>TOTAL CATALOG: {productList.length} PRODUCTS</span>
      </div>

      {/* ─── ADD / EDIT PRODUCT MODAL (SUPR MONOCHROME MODAL) ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0a0a0a] border border-white/15 rounded-sm p-6 md:p-8 max-w-lg w-full space-y-6 relative shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-sm border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Title */}
              <div className="border-b border-white/10 pb-4">
                <span className="text-neutral-500 font-mono text-[10px] font-bold tracking-widest uppercase block">CATALOG MANAGEMENT</span>
                <h3 className="text-xl font-black uppercase text-white tracking-wider mt-1">
                  {editingProduct ? 'EDIT PRODUCT & PHOTOS' : 'ADD NEW PRODUCT'}
                </h3>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                    PRODUCT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="E.G. ANEMONE CRIMP SET PRO"
                    className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all placeholder-neutral-700 uppercase tracking-wider"
                  />
                </div>

                {/* Category & Material */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                      CATEGORY
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all uppercase tracking-wider"
                    >
                      <option value="Holds" className="bg-black">Holds</option>
                      <option value="Macros" className="bg-black">Macros</option>
                      <option value="Volumes" className="bg-black">Volumes</option>
                      <option value="Hangboard" className="bg-black">Hangboard</option>
                      <option value="Bouldering Essentials" className="bg-black">Bouldering Essentials</option>
                      <option value="Smart Wall Kit" className="bg-black">Smart Wall Kit</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                      MATERIAL
                    </label>
                    <select
                      value={form.material}
                      onChange={(e) => setForm({ ...form, material: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all uppercase tracking-wider"
                    >
                      <option value="PU" className="bg-black">PU (Polyurethane)</option>
                      <option value="PE" className="bg-black">PE (Polyester)</option>
                      <option value="Fiberglass" className="bg-black">Fiberglass</option>
                      <option value="Plywood" className="bg-black">Plywood</option>
                      <option value="Wood" className="bg-black">Wood</option>
                    </select>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                      PRICE (IDR)
                    </label>
                    <input
                      type="number"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="485000"
                      className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all placeholder-neutral-700"
                    />
                  </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                    STOCK (UNITS)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="25"
                    className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all"
                  />
                </div>
              </div>

                {/* MULTIPLE PHOTOS UPLOAD SECTION */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                      PHOTOS GALLERY
                    </label>
                    <span className="font-mono text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-sm">
                      {form.images.length} ADDED
                    </span>
                  </div>

                  {/* Upload Box */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMultipleFileUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border border-dashed border-white/20 hover:border-white/50 bg-black rounded-sm p-4 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-2 ${
                      isUploading ? 'opacity-50 cursor-wait' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 group-hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                      {isUploading ? <Loader2 size={16} className="animate-spin text-teal" /> : <Upload size={16} />}
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        {isUploading ? 'COMPRESSING & PROCESSING PHOTOS...' : 'SELECT PRODUCT PHOTOS FROM COMPUTER'}
                      </p>
                      <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
                        MULTIPLE FILES SUPPORTED (AUTO-OPTIMIZED JPG, PNG, WEBP)
                      </p>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {form.images.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-neutral-500 block">
                        PREVIEW GALLERY:
                      </span>
                      <div className="flex gap-2.5 overflow-x-auto pb-2">
                        {form.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 rounded-sm overflow-hidden bg-black border border-white/15 shrink-0 group"
                          >
                            <img src={img} alt={`uploaded ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 w-4 h-4 bg-black/90 hover:bg-rose-600 text-white rounded-sm flex items-center justify-center transition-all cursor-pointer"
                              title="Remove photo"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="PRODUCT DESCRIPTION..."
                    className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs font-mono text-white focus:border-white/40 outline-none transition-all placeholder-neutral-700 resize-none uppercase tracking-wider"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-sm hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <Check size={16} />
                    <span>{editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
