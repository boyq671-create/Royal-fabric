'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cotton');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!title || !price || !imageFile) {
      alert('Kripya saari details aur photo upload karein!');
      return;
    }
    setLoading(true);

    try {
      // 1. Upload Image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get Image Public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // 2. Save Product Data
      const { error: insertError } = await supabase.from('products').insert([
        { title, category, price: parseFloat(price), description, image_url: imageUrl }
      ]);

      if (insertError) throw insertError;

      alert('Product Successfully Add Ho Gaya!');
      setTitle('');
      setPrice('');
      setDescription('');
      setImageFile(null);
      fetchProducts();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (confirm('Kya aap is product ko delete karna chahte hain?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>👑 Admin Dashboard</h1>

      <form onSubmit={handleAddProduct} style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>➕ New Product Add Karein</h3>
        
        <label>Product Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} placeholder="e.g. Pure Cotton Kurta Material" />

        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="Cotton">Cotton</option>
          <option value="Linen">Linen</option>
          <option value="Suiting">Suiting</option>
          <option value="Shirting">Shirting</option>
          <option value="Silk">Silk</option>
        </select>

        <label>Price (₹):</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyle} placeholder="e.g. 1499" />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, height: '60px' }} placeholder="Fabric quality details..." />

        <label>Product Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required style={{ marginBottom: '15px', display: 'block' }} />

        <button type="submit" disabled={loading} style={{ background: '#000', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px', width: '100%', fontSize: '16px', cursor: 'pointer' }}>
          {loading ? 'Uploading...' : 'Save Product'}
        </button>
      </form>

      <h3>📦 Added Products ({products.length})</h3>
      <div>
        {products.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #ddd', padding: '10px 0' }}>
            <img src={p.image_url} alt={p.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block' }}>{p.title}</strong>
              <small style={{ color: '#666' }}>{p.category} - ₹{p.price}</small>
            </div>
            <button onClick={() => handleDelete(p.id)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0 15px 0',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ccc'
};
