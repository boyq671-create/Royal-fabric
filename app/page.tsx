"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { 
  ShoppingBag, Search, Heart, Menu, ArrowRight, ShieldCheck, 
  Truck, RefreshCw, PlusCircle, Trash2, Package, ArrowLeft, 
  CreditCard, MessageSquare, Phone, MessageCircle 
} from "lucide-react";

// --- SUPABASE CLIENT ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rwipsolrguuapfpgnrmd.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_w6bs04y-_cJe8NhN49erNA_gw7oD9js";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- CART CONTEXT ---
interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  quantity: number;
}

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("rf_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("rf_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert("Item added to Cart!");
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  };
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// --- MAIN HOME PAGE COMPONENT ---
export default function RoyalFabricApp() {
  const [view, setView] = useState<"store" | "admin" | "checkout">("store");
  const [products, setProducts] = useState<any[]>([]);

  // Form States for Admin
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Cotton");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Products from Database
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Add Product (Admin)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("products").insert([{ title, category, price: parseFloat(price), image_url: imageUrl }]);
    setLoading(false);
    if (!error) {
      alert("Product Live Ho Gaya!");
      setTitle(""); setPrice(""); setImageUrl("");
      fetchProducts();
    } else {
      alert("Error: " + error.message);
    }
  };

  // Delete Product (Admin)
  const handleDelete = async (id: string) => {
    if (confirm("Delete karna chahte hain?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        
        {/* Top Info Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 flex justify-between items-center">
          <p className="truncate">📍 Shop No. 1220/1, Morigate, Manimajra, Chandigarh</p>
          <div className="flex gap-4 shrink-0">
            <a href="tel:8273372068" className="flex items-center gap-1 text-amber-400">8273372068</a>
            <a href="https://wa.me/919917865672" target="_blank" className="text-green-400">WhatsApp</a>
          </div>
        </div>

        {/* Header / Navbar */}
        <header className="bg-white border-b sticky top-0 z-50 p-4 flex justify-between items-center max-w-7xl mx-auto">
          <button onClick={() => setView("store")} className="flex items-center gap-2">
            <div className="bg-amber-600 text-white font-bold w-9 h-9 rounded flex items-center justify-center">RF</div>
            <div>
              <span className="font-bold text-lg block leading-none">ROYAL FABRIC</span>
              <span className="text-[9px] text-amber-700 tracking-widest font-bold">CHANDIGARH</span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <button onClick={() => setView("admin")} className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded">
              Admin Panel
            </button>
            <button onClick={() => setView("checkout")} className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" /> Cart
            </button>
          </div>
        </header>

        {/* --- VIEW 1: STORE FRONT --- */}
        {view === "store" && (
          <main className="max-w-7xl mx-auto p-4 space-y-8">
            {/* Hero Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-12 grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full border border-amber-500/30">
                  Premium Fabrics
                </span>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">Best Quality Dress Material in Manimajra</h1>
                <p className="text-slate-300 text-sm">Cotton, Linen, Suiting & Shirting collections direct from Royal Fabric shop.</p>
                <div className="flex gap-3 pt-2">
                  <a href="https://wa.me/919917865672" target="_blank" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-lg flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Direct WhatsApp Order
                  </a>
                </div>
              </div>
            </div>

            {/* Live Products */}
            <div>
              <h2 className="text-xl font-bold mb-4">Latest Fabrics</h2>
              {products.length === 0 ? (
                <p className="text-slate-400 text-sm">Admin Panel se pehla product add karein!</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              )}
            </div>
          </main>
        )}

        {/* --- VIEW 2: ADMIN PANEL --- */}
        {view === "admin" && (
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
              <h1 className="font-bold text-lg">Admin Dashboard (Add/Delete Products)</h1>
              <button onClick={() => setView("store")} className="text-sm text-slate-500">← Back to Store</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Form */}
              <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-xl border space-y-3">
                <h3 className="font-bold text-sm">Naya Product Add Karein</h3>
                <input type="text" placeholder="Title (e.g. Pure Linen)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded text-sm" required />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded text-sm">
                  <option>Cotton</option><option>Linen</option><option>Suiting</option><option>Shirting</option>
                </select>
                <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded text-sm" required />
                <input type="url" placeholder="Photo Link (Image URL)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border rounded text-sm" required />
                <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white font-bold py-2 rounded text-sm">
                  {loading ? "Adding..." : "Save Product"}
                </button>
              </form>

              {/* Inventory */}
              <div className="bg-white p-5 rounded-xl border space-y-3">
                <h3 className="font-bold text-sm">Live Items ({products.length})</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {products.map((p) => (
                    <div key={p.id} className="flex justify-between items-center border p-2 rounded text-xs">
                      <div>
                        <p className="font-bold">{p.title}</p>
                        <p className="text-amber-700 font-bold">₹{p.price}</p>
                      </div>
                      <button onClick={() => handleDelete(p.id)} className="text-rose-500 font-bold">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 3: CART & CHECKOUT --- */}
        {view === "checkout" && <CheckoutView onBack={() => setView("store")} />}

      </div>
    </CartProvider>
  );
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  return (
    <div className="bg-white border rounded-xl overflow-hidden p-3 flex flex-col justify-between">
      <img src={product.image_url} alt={product.title} className="h-40 w-full object-cover rounded-lg mb-2" />
      <div>
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{product.category}</span>
        <h4 className="font-bold text-sm mt-1">{product.title}</h4>
        <p className="text-amber-700 font-bold text-sm">₹{product.price}</p>
      </div>
      <button onClick={() => addToCart(product)} className="mt-3 w-full bg-slate-900 text-white text-xs font-bold py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
}

// Checkout View Component
function CheckoutView({ onBack }: { onBack: () => void }) {
  const { cart, removeFromCart, totalAmount } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleWhatsApp = () => {
    if (!name || !phone || !address) return alert("Delivery details bharein!");
    let list = cart.map((i: any) => `• ${i.title} (${i.quantity}m) - ₹${i.price * i.quantity}`).join("%0A");
    let msg = `*NEW ORDER - ROYAL FABRIC*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A%0A*Items:*%0A${list}%0A%0A*Total:* ₹${totalAmount}`;
    window.open(`https://wa.me/919917865672?text=${msg}`, "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <button onClick={onBack} className="text-xs font-bold text-slate-500">← Shopping Continue Karein</button>
      <div className="bg-white p-5 rounded-xl border space-y-4">
        <h2 className="font-bold text-lg">Checkout ({cart.length} items)</h2>
        <div className="space-y-2">
          {cart.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2 text-xs">
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-amber-700 font-bold">₹{item.price} x {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-rose-500">Remove</button>
            </div>
          ))}
        </div>
        <div className="text-right font-bold text-base">Total: ₹{totalAmount}</div>
        
        <div className="space-y-2 pt-2 border-t">
          <input type="text" placeholder="Aapka Naam" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded text-xs" />
          <input type="tel" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded text-xs" />
          <textarea placeholder="Poora Pata" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded text-xs" />
          <button onClick={handleWhatsApp} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded text-xs flex justify-center items-center gap-2">
            Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
