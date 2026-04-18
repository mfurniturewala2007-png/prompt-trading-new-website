import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Edit, Trash2, UploadCloud, Save, X, Search, Settings, Tag, Package } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const fileInputRef = useRef(null);
  const brandFileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'brands', 'settings'
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');

  // Products State
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', part_number: '', price: '', quantity_in_stock: '', brand: '', sub_brand: '', category: '', image_url: '' });

  // Brands State
  const [brands, setBrands] = useState([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [brandForm, setBrandForm] = useState({ name: '', description: '', image_url: '' });

  // Settings State
  const [settings, setSettings] = useState({ about_text: '', goal: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } else if (activeTab === 'brands') {
        const { data, error } = await supabase.from('brands').select('*');
        if (error) throw error;
        setBrands(data || []);
      } else if (activeTab === 'settings') {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') throw error; // ignore no rows error
        if (data) setSettings(data);
      }
      setDbError('');
    } catch (err) {
      console.error(err);
      if (err.code === '42P01') {
        setDbError(`Database table does not exist for this tab. Please run the SQL command in Supabase for table '${activeTab}'.`);
      } else {
        setDbError(err.message);
      }
    }
    setLoading(false);
  };

  /* ---- Products Logic ---- */
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProductId(product.id);
      setProductForm(product);
    } else {
      setEditingProductId(null);
      setProductForm({ name: '', part_number: '', price: '', quantity_in_stock: '', brand: '', sub_brand: '', category: '', image_url: '' });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (editingProductId) {
      await supabase.from('products').update(productForm).eq('id', editingProductId);
    } else {
      await supabase.from('products').insert([productForm]);
    }
    setIsProductModalOpen(false);
    fetchAllData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchAllData();
    }
  };

  const handleProductFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (data.length === 0) return alert("The Excel file is empty!");

        alert(`Found ${data.length} products in the Excel file. Attempting to upload...`);

        const formattedData = data.map(item => ({
          name: item['Tool Name'] || item.name || item.Name || item['Product Name'] || 'Unknown Product',
          part_number: String(item['Part Number'] || item.part_number || item['Part number'] || ''),
          price: parseFloat(item.price || item.Price || item.Cost || 0) || 0,
          quantity_in_stock: parseInt(item['Quantity in Stock'] || item.quantity || item.Quantity || 0) || 0,
          brand: item.Brand || item.brand || 'Unknown Brand',
          sub_brand: item['Sub-Brand'] || item.sub_brand || item.subbrand || '',
          category: item['Tool Category'] || item.category || item.Category || 'General',
          image_url: item.image_url || item['Image URL'] || item.imageUrl || ''
        }));

        const { error } = await supabase.from('products').insert(formattedData);
        if (error) {
           console.error(error);
           alert("Error uploading data to database: " + error.message);
        } else {
           alert(`Successfully imported ${formattedData.length} products!`);
           fetchAllData();
        }
      } catch (err) {
        console.error(err);
        alert("Failed to read the Excel file.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const handleBrandFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (data.length === 0) return alert("The Excel file is empty!");

        alert(`Found ${data.length} brands in the Excel file. Attempting to upload...`);

        const formattedData = data.map(item => ({
          name: item['Brand Name'] || item.name || item.Name || 'Unknown Brand',
          description: item.Description || item.description || '',
          image_url: item['Logo URL'] || item['Image URL'] || item.image_url || ''
        }));

        const { error } = await supabase.from('brands').insert(formattedData);
        if (error) {
           console.error(error);
           alert("Error uploading brands: " + error.message);
        } else {
           alert(`Successfully imported ${formattedData.length} brands!`);
           fetchAllData();
        }
      } catch (err) {
        console.error(err);
        alert("Failed to read the Excel file.");
      }
      if (brandFileInputRef.current) brandFileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };
  /* ---- Brands Logic ---- */
  const handleOpenBrandModal = (brand = null) => {
    if (brand) {
      setEditingBrandId(brand.id);
      setBrandForm(brand);
    } else {
      setEditingBrandId(null);
      setBrandForm({ name: '', description: '', image_url: '' });
    }
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (editingBrandId) {
      await supabase.from('brands').update(brandForm).eq('id', editingBrandId);
    } else {
      await supabase.from('brands').insert([brandForm]);
    }
    setIsBrandModalOpen(false);
    fetchAllData();
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      await supabase.from('brands').delete().eq('id', id);
      fetchAllData();
    }
  };

  /* ---- Settings Logic ---- */
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single();
    if (existing) {
      await supabase.from('site_settings').update(settings).eq('id', existing.id);
    } else {
      await supabase.from('site_settings').insert([settings]);
    }
    setSavingSettings(false);
    alert("Settings saved successfully!");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password gate
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container section-py" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass" style={{ padding: '3rem', borderRadius: 'var(--radius-xl)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Admin Login</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please enter the master password to access the content management system.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="password" required className="form-input" placeholder="Enter Password..." value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-py" style={{ maxWidth: '1400px' }}>
      
      {dbError && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <strong>Database Error:</strong> {dbError}
        </div>
      )}

      {/* Header and Tabs */}
      <h1 className="text-gradient" style={{ marginBottom: '1.5rem' }}>Site Administration</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('products')} 
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', color: activeTab === 'products' ? 'white' : 'var(--text-secondary)', background: activeTab === 'products' ? 'var(--primary-color)' : 'transparent', transition: 'var(--transition)' }}
        >
          <Package size={20} /> Products Inventory
        </button>
        <button 
          onClick={() => setActiveTab('brands')} 
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', color: activeTab === 'brands' ? 'white' : 'var(--text-secondary)', background: activeTab === 'brands' ? 'var(--primary-color)' : 'transparent', transition: 'var(--transition)' }}
        >
          <Tag size={20} /> Authorized Brands
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', color: activeTab === 'settings' ? 'white' : 'var(--text-secondary)', background: activeTab === 'settings' ? 'var(--primary-color)' : 'transparent', transition: 'var(--transition)' }}
        >
          <Settings size={20} /> About Us & Content
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading {activeTab} database...</div>
      ) : (
        <>
          {/* ---- TAB: PRODUCTS ---- */}
          {activeTab === 'products' && (
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', background: 'var(--surface-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="text" className="form-input" placeholder="Search products..." style={{ paddingLeft: '2.5rem' }} value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    ref={fileInputRef} 
                    onChange={handleProductFileUpload} 
                    style={{ display: 'none' }} 
                  />
                  <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud size={20} /> Import Excel
                  </button>
                  <button className="btn btn-primary" onClick={() => handleOpenProductModal()}><PlusCircle size={20} /> Add Tool</button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Tool Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Brand</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Qty</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Price</th>
                    <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p => p.name?.toLowerCase().includes(searchProduct.toLowerCase())).map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{product.name}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{product.brand} {product.sub_brand && `(${product.sub_brand})`}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{product.category}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{product.quantity_in_stock}</td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>₹{Number(product.price).toFixed(2)}</td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <button onClick={() => handleOpenProductModal(product)} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}><Edit size={18} /></button>
                        <button onClick={() => handleDeleteProduct(product.id)} style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---- TAB: BRANDS ---- */}
          {activeTab === 'brands' && (
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', background: 'var(--surface-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Authorized Brands</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    ref={brandFileInputRef} 
                    onChange={handleBrandFileUpload} 
                    style={{ display: 'none' }} 
                  />
                  <button className="btn btn-outline" onClick={() => brandFileInputRef.current?.click()}>
                    <UploadCloud size={20} /> Import Excel
                  </button>
                  <button className="btn btn-primary" onClick={() => handleOpenBrandModal()}><PlusCircle size={20} /> Add Brand</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {brands.map(brand => (
                  <div key={brand.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenBrandModal(brand)} style={{ color: 'var(--text-secondary)' }}><Edit size={16}/></button>
                      <button onClick={() => handleDeleteBrand(brand.id)} style={{ color: '#ef4444' }}><Trash2 size={16}/></button>
                    </div>
                    <div style={{ height: '80px', width: '140px', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden' }}>
                      {brand.image_url ? <img src={brand.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}/> : <Tag size={32} color="var(--primary-dark)" />}
                    </div>
                    <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{brand.name}</h3>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{brand.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- TAB: SETTINGS ---- */}
          {activeTab === 'settings' && (
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', background: 'var(--surface-color)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>About Us & What We Do</h2>
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Goal / Headline</label>
                  <input required type="text" className="form-input" value={settings.goal || ''} onChange={e => setSettings({...settings, goal: e.target.value})} placeholder="e.g. To provide the best tools globally." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full About Us Description</label>
                  <textarea required className="form-input" rows="8" value={settings.about_text || ''} onChange={e => setSettings({...settings, about_text: e.target.value})} placeholder="Write the history and mission of Prompt Trading here..." />
                </div>
                <div>
                  <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                    {savingSettings ? 'Saving...' : 'Publish Content'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* --- MODALS --- */}
      {/* Product Modal */}
      {isProductModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface-color)', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-xl)', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsProductModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '2rem' }}>{editingProductId ? 'Edit Tool' : 'Add Tool'}</h2>
            <form onSubmit={handleSaveProduct} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
              <input required type="text" className="form-input" placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} style={{ gridColumn: '1 / -1' }}/>
              <input required type="text" className="form-input" placeholder="Part Number" value={productForm.part_number} onChange={e => setProductForm({...productForm, part_number: e.target.value})} />
              <input required type="number" step="0.01" className="form-input" placeholder="Price" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
              <input required type="number" className="form-input" placeholder="Quantity in Stock" value={productForm.quantity_in_stock} onChange={e => setProductForm({...productForm, quantity_in_stock: e.target.value})} />
              <input required type="text" className="form-input" placeholder="Brand" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} />
              <input type="text" className="form-input" placeholder="Sub-Brand" value={productForm.sub_brand} onChange={e => setProductForm({...productForm, sub_brand: e.target.value})} />
              <input required type="text" className="form-input" placeholder="Category" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} />
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface-color)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-xl)', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsBrandModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '2rem' }}>{editingBrandId ? 'Edit Brand' : 'Add Brand'}</h2>
            <form onSubmit={handleSaveBrand} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required type="text" className="form-input" placeholder="Brand Name" value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} />
              <textarea required className="form-input" rows="2" placeholder="Description (Optional)" value={brandForm.description} onChange={e => setBrandForm({...brandForm, description: e.target.value})} />
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Logo URL (Must be a direct link to an image file)</label>
                <input type="text" className="form-input" placeholder="https://example.com/logo.png" value={brandForm.image_url} onChange={e => setBrandForm({...brandForm, image_url: e.target.value})} />
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.25rem' }}>How to get the correct link from Google:</strong>
                <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', margin: 0 }}>
                  <li>Search for the brand logo on Google Images.</li>
                  <li><strong>Right-click</strong> the image.</li>
                  <li>Select <strong>"Copy image address"</strong> (NOT "Copy link address").</li>
                  <li>Paste that link here.</li>
                </ol>
              </div>

              {brandForm.image_url && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Preview:</span>
                  <img src={brandForm.image_url} alt="Preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} 
                       onError={(e) => {
                         e.target.style.display = 'none';
                         alert("Logo preview failed! Please ensure the URL is a direct link to an image (ending in .png, .jpg, etc).");
                       }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsBrandModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
