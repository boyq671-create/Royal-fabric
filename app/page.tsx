'use client';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedImageMap, setSelectedImageMap] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (product: any) => {
    const selectedImg = selectedImageMap[product.id] || product.image_url;
    setCart((prev) => [...prev, { ...product, selectedImg }]);
    alert(`${product.title} Cart me add ho gaya! 🛒`);
  };

  const handleWhatsAppOrder = (product: any) => {
    const phone = product.phone || "919917865672"; 
    const currentImg = selectedImageMap[product.id] || product.image_url;
    const message = `Hello Royal Fabric! 👑\n\nMujhe ye product order karna hai:\n*Product:* ${product.title}\n*Category:* ${product.category}\n*Contact:* ${product.phone || 'N/A'}\n*Image Link:* ${currentImg}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header Section */}
      <header style={{ 
        background: '#111', 
        color: '#fff', 
        padding: '12px 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        
        <div>
          <h1 style={{ 
            color: '#d4af37', 
            margin: 0, 
            fontSize: '20px', 
            letterSpacing: '1px', 
            fontWeight: 'bold' 
          }}>
            ROYAL FABRIC
          </h1>
          
          <div style={{ fontSize: '11px', color: '#ccc', marginTop: '4px', lineHeight: '1.4' }}>
            📍 SHOP NO. 1220/1, MORIGATE, MANIMAJRA, CHD. <br />
            📞 8273372068 | 9917865672
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>❤️ ({wishlist.length})</span>
          <span>🛒 ({cart.length})</span>
        </div>

      </header>

      {/* 🔍 Search */}
      <div style={{ padding: '20px 15px', background: '#1a1a1a', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Premium Fabric Collection</h2>
        <input
          type="text"
          placeholder="🔍 Search fabric, crepe, cotton..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '90%', maxWidth: '400px', padding: '10px 15px', borderRadius: '25px', border: 'none' }}
        />
      </div>

      {/* 🏷️ Categories */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px 15px', background: '#fff' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedCategory === cat ? '#d4af37' : '#eee',
              color: selectedCategory === cat ? '#fff' : '#333',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📦 Product Grid */}
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProducts.map((product) => {
          const isWishlisted = wishlist.includes(product.id);
          const activeImage = selectedImageMap[product.id] || product.image_url;

          return (
            <div key={product.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,0.08)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              
              <button
                onClick={() => toggleWishlist(product.id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 10 }}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>

              <div style={{ background: '#f5f5f5', width: '100%', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setPreviewImage(activeImage)}>
                <img
                  src={activeImage}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', padding: '8px 10px', background: '#fafafa', overflowX: 'auto', borderTop: '1px solid #eee' }}>
                  {product.images.map((imgUrl: string, idx: number) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      onClick={() => setSelectedImageMap({ ...selectedImageMap, [product.id]: imgUrl })}
                      style={{
                        width: '36px',
                        height: '36px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: activeImage === imgUrl ? '2px solid #d4af37' : '1px solid #ddd'
                      }}
                    />
                  ))}
                </div>
              )}

              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <small style={{ color: '#888', textTransform: 'uppercase' }}>{product.category}</small>
                  <h3 style={{ fontSize: '16px', margin: '4px 0 6px 0' }}>{product.title}</h3>
                  <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0' }}>{product.description}</p>
                  
                  {/* Price hatakar Contact Number dikhaya hai */}
                  {product.phone && (
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', marginBottom: '10px' }}>
                      📞 {product.phone}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => addToCart(product)} style={{ flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🛒 Add</button>
                  <button onClick={() => handleWhatsAppOrder(product)} style={{ flex: 1.5, padding: '10px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>💬 Buy on WA</button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {previewImage && (
        <div onClick={() => setPreviewImage(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <span style={{ position: 'absolute', top: '20px', right: '25px', color: '#fff', fontSize: '30px', cursor: 'pointer' }}>✕</span>
          <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}

    </div>
  );
}
