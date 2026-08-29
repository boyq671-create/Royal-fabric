'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cotton');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!title || !price || imageFiles.length === 0) {
      alert('Kripya details aur kam se kam 1 photo select karein!');
      return;
    }
    setLoading(true);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split('.').pop();
        const cleanFileName = `${Date.now()}_${i}.${fileExt}`;

        setStatusMsg(`Uploading photo ${i + 1} of ${imageFiles.length}...`);

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(cleanFileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(cleanFileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      setStatusMsg('Database me save ho raha hai...');

      const { error: insertError } = await supabase.from('products').insert([
        {
          title,
          category,
          price: parseFloat(price),
          description,
          image_url: uploadedUrls[0],
          images: uploadedUrls
        }
      ]);

      if (insertError) throw insertError;

      alert(`✅ Ready! ${uploadedUrls.length} photos ke saath product add ho gaya!`);
      setTitle('');
      setPrice('');
      setDescription('');
      setImageFiles([]);
      setStatusMsg('');
      e.target.reset();
      fetchProducts();
    } catch (err) {
      alert('❌ Error: ' + err.message);
      setStatusMsg('');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (confirm('Delete karein?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>👑 Admin Dashboard</h1>

      <form onSubmit={handleAddProduct} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>➕ New Product Add Karein</h3>
        
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} placeholder="Product Name" />

        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="Cotton">Cotton</option>
          <option value="Natural Crepe">Natural Crepe</option>
          <option value="Linen">Linen</option>
          <option value="Suiting">Suiting</option>
          <option value="Shirting">Shirting</option>
          <option value="Silk">Silk</option>
        </select>

        <label>Price (₹):</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyle} placeholder="1499" />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, height: '60px' }} />

        <label style={{ fontWeight: 'bold' }}>Product Images (Multiple Select Karein):</label>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={(e) => setImageFiles(Array.from(e.target.files))} 
          required 
          style={{ marginBottom: '10px', display: 'block', marginTop: '5px' }} 
        />
        
        {imageFiles.length > 0 && (
          <p style={{ color: 'green', fontSize: '13px', margin: '0 0 15px 0' }}>
            📸 <strong>{imageFiles.length}</strong> photos selected.
          </p>
        )}

        {statusMsg && <p style={{ color: '#d4af37', fontWeight: 'bold' }}>{statusMsg}</p>}

        <button type="submit" disabled={loading} style={{ background: loading ? '#666' : '#000', color: '#fff', padding: '12px', width: '100%', borderRadius: '6px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Uploading...' : 'Save Product'}
        </button>
      </form>

      <h3>📦 Added Products ({products.length})</h3>
      {products.map((p) => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #ddd', padding: '12px 0' }}>
          <img src={p.image_url} alt={p.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
          <div style={{ flex: 1 }}>
            <strong>{p.title}</strong>
            <div><small>{p.category} - ₹{p.price}</small></div>
            <div style={{ fontSize: '11px', color: '#777' }}>Total Images: {p.images ? p.images.length : 1}</div>
          </div>
          <button onClick={() => handleDelete(p.id)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', margin: '5px 0 15px 0', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' };
