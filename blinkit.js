import React, { useEffect, useState } from 'react';
import api from './services/api';
import ProductCard from './components/ProductCard';

export default function App(){
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(()=> {
    async function load(){ 
      const res = await api.get('/products');
      setProducts(res.data);
    }
    load();
  }, []);

  function addToCart(product){
    const existing = cart.find(c => c.productId === product._id);
    if (existing) {
      setCart(cart.map(c => c.productId === product._id ? {...c, qty: c.qty+1} : c));
    } else {
      setCart([...cart, { productId: product._id, name: product.name, price: product.price, qty: 1 }]);
    }
  }

  async function placeOrder(){
    const res = await api.post('/orders', {
      items: cart.map(c => ({ productId: c.productId, qty: c.qty })),
      customerName: 'Demo User',
      address: '123 Main St'
    });
    alert('✅ Order placed: ' + res.data._id);
    setCart([]);
  }

  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🛒 Blinkit Clone</h1>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h2>Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {products.map(p => <ProductCard key={p._id} product={p} onAdd={()=>addToCart(p)} />)}
          </div>
        </div>

        <div style={{ width: 320, border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
          <h3>Cart</h3>
          {cart.length === 0 && <div>Cart is empty</div>}
          {cart.map(item => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>{item.n
