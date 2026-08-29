'use client';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImageMap, setSelectedImageMap] = useState({});

  const categories = ['All', 'Cotton', 'Natural Crepe', 'Linen', 'Suiting', 'Shirting', 'Silk'];

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
  }

  // Filter & Search Logic
  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim() !== '') {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  // Wishlist Toggle
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add to Cart
  const addToCart = (product) => {
    const selectedImg = selectedImageMap[product.id] || product.image_url;
    setCart((prev) => [...prev, { ...product, selectedImg }]);
    alert(`${product.title} Cart me add ho gaya! 🛒`);
  };

  // WhatsApp Order Flow
  const handleWhatsAppOrder = (product) => {
    const phone = "919917865672"; // 👈 Apna WhatsApp Number yahan daalein (country code ke sath, bina + ke)
    const currentImg = selectedImageMap[product.id] || product.image_url;
    
    const message = `Hello Royal Fabric! 👑\n\nMujhe ye product order karna hai:\n*Product:* ${product.title}\n*Category:* ${product.category}\n*Price:* ₹${product.price}\n*Image Link:* ${currentImg}\n\nKripya order details aage confirm karein.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 👑 Top Navigation Header */}
      <header style={{ background: '#111', color: '#fff', padding: '15px 20px', sticky: 'top', position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '22px', letterSpacing: '2px', fontWeight: '700', color: '#d4af37' }}>ROYAL FABRIC</h1>
        <div style={{ display: 'flex', gap: '15px', fontSize: '18px' }}>
          <span>❤️ <small style={{ fontSize: '12px' }}>({wishlist.length})</small></span>
          <span>🛒 <small style={{ fontSize: '12px' }}>({cart.length})</small></span>
        </div>
      </header>

      {/* 🔍 Search & Hero Section */}
      <div style={{ padding: '20px', background: '#1a1a1a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '300' }}>Premium Fabric Collection</h2>
        <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>Select best quality fabrics directly for your wardrobe</p>
        
        <input
          type="text"
          placeholder="🔍 Search fabric, crepe, cotton, linen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '90%', maxWidth: '500px', padding: '12px 18px', borderRadius: '30px', border: 'none', outline: 'none', fontSize: '15px' }}
        />
      </div>

      {/* 🏷️ Category Slider */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px 20px', background: '#fff', borderBottom: '1px solid #eee' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '25px',
              border: selectedCategory === cat ? 'none' : '1px solid #ddd',
              background: selectedCategory === cat ? '#d4af37' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#333',
              fontWeight: selectedCategory === cat ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 Product Grid */}
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#777', padding: '40px' }}>Koi product nahi mila!</p>
        ) : (
          filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const activeImage = selectedImageMap[product.id] || product.image_url;

            return (
              <div key={product.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                
                {/* Wishlist Icon */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', zIndex: 10, fontSize: '16px' }}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>

                {/* Active Product Image */}
                <img
                  src={activeImage}
                  alt={product.title}
                  style={{ width: '100%', height: '280px', objectFit: 'cover' }}
                />

                {/* Color Variants Thumbnails (If multiple images available) */}
                {product.images && product.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', background: '#fafafa', borderBottom: '1px solid #eee', overflowX: 'auto' }}>
                    {product.images.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt="color"
                        onClick={() => setSelectedImageMap({ ...selectedImageMap, [product.id]: imgUrl })}
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          border: activeImage === imgUrl ? '2px solid #d4af37' : '1px solid #ccc'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Product Details */}
                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
                    <h3 style={{ fontSize: '16px', margin: '4px 0 8px 0', color: '#222', fontWeight: '600' }}>{product.title}</h3>
                    <p style={{ fontSize: '13px', color: '#666', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111', marginBottom: '15px' }}>₹{product.price}</div>
                  </div>

                  {/* Actions Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => addToCart(product)}
                      style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                    >
                      🛒 Add
                    </button>
                    <button
                      onClick={() => handleWhatsAppOrder(product)}
                      style={{ flex: 1.5, padding: '10px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                    >
                      💬 Buy on WA
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
