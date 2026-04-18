import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Edit, Trash2, UploadCloud, X, Search, Settings, Tag, Package, FolderUp, CheckCircle, AlertCircle, Loader, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const fileInputRef = useRef(null);
  const brandFileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'brands', 'customers', 'settings'
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
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const brandLogoFileRef = useRef(null);

  // Folder Upload State
  const [folderUploadFiles, setFolderUploadFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]); // [{name, status, url}]
  const [isUploading, setIsUploading] = useState(false);
  const folderInputRef = useRef(null);

  // Customers State
  const [customers, setCustomers] = useState([]);

  // Settings State
  const [settings, setSettings] = useState({ about_text: '', goal: '', enquiry_email: 'mfurniturewala2007@gmail.com' });
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
      } else if (activeTab === 'customers') {
        const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setCustomers(data || []);
      } else if (activeTab === 'settings') {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') throw error; // ignore no rows error
        if (data) setSettings({ about_text: '', goal: '', enquiry_email: 'mfurniturewala2007@gmail.com', ...data });
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

  /* ---- Folder Upload Logic ---- */
  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files).filter(f =>
      f.type.startsWith('image/')
    );
    setFolderUploadFiles(files);
    setUploadProgress(files.map(f => ({ name: f.name, status: 'pending', url: '' })));
  };

  const handleFolderUpload = async () => {
    if (folderUploadFiles.length === 0) return;
    setIsUploading(true);

    for (let i = 0; i < folderUploadFiles.length; i++) {
      const file = folderUploadFiles[i];
      const brandName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      const storagePath = `logos/${Date.now()}_${file.name}`;

      setUploadProgress(prev => prev.map((p, idx) =>
        idx === i ? { ...p, status: 'uploading' } : p
      ));

      try {
        // 1. Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('brand-logos')
          .upload(storagePath, file, { upsert: true, contentType: file.type });

        if (uploadError) throw uploadError;

        // 2. Get the public URL
        const { data: urlData } = supabase.storage
          .from('brand-logos')
          .getPublicUrl(storagePath);
        const publicUrl = urlData.publicUrl;

        // 3. Upsert brand record (match by name)
        const existing = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
        if (existing) {
          await supabase.from('brands').update({ image_url: publicUrl }).eq('id', existing.id);
        } else {
          await supabase.from('brands').insert([{ name: brandName, image_url: publicUrl }]);
        }

        setUploadProgress(prev => prev.map((p, idx) =>
          idx === i ? { ...p, status: 'done', url: publicUrl } : p
        ));
      } catch (err) {
        console.error(err);
        setUploadProgress(prev => prev.map((p, idx) =>
          idx === i ? { ...p, status: 'error', error: err.message } : p
        ));
      }
    }

    setIsUploading(false);
    fetchAllData();
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
    setBrandLogoFile(null);
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();

    // Build the payload — omit empty optional fields
    let finalForm = {
      name: brandForm.name,
      ...(brandForm.description ? { description: brandForm.description } : {}),
      ...(brandForm.image_url   ? { image_url: brandForm.image_url }     : {}),
    };

    // If a new logo file was picked, upload it and override image_url
    if (brandLogoFile) {
      const storagePath = `logos/${Date.now()}_${brandLogoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('brand-logos')
        .upload(storagePath, brandLogoFile, { upsert: true, contentType: brandLogoFile.type });
      if (uploadError) { alert('Logo upload failed: ' + uploadError.message); return; }
      const { data: urlData } = supabase.storage.from('brand-logos').getPublicUrl(storagePath);
      finalForm.image_url = urlData.publicUrl;
    }

    if (editingBrandId) {
      await supabase.from('brands').update(finalForm).eq('id', editingBrandId);
    } else {
      await supabase.from('brands').insert([finalForm]);
    }
    setIsBrandModalOpen(false);
    setBrandLogoFile(null);
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
          onClick={() => setActiveTab('customers')} 
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', color: activeTab === 'customers' ? 'white' : 'var(--text-secondary)', background: activeTab === 'customers' ? 'var(--primary-color)' : 'transparent', transition: 'var(--transition)' }}
        >
          <Users size={20} /> Registered Customers
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Authorized Brands</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    webkitdirectory="true"
                    ref={folderInputRef}
                    onChange={handleFolderSelect}
                    style={{ display: 'none' }}
                  />
                  <button className="btn btn-outline" onClick={() => folderInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FolderUp size={20} /> Upload Logo Folder
                  </button>
                  <button className="btn btn-primary" onClick={() => handleOpenBrandModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlusCircle size={20} /> Add Brand
                  </button>
                </div>
              </div>

              {/* Folder Upload Panel */}
              {folderUploadFiles.length > 0 && (
                <div style={{ marginBottom: '2rem', border: '1px solid rgba(130,211,222,0.3)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', background: 'rgba(130,211,222,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem' }}>📂 Ready to upload {folderUploadFiles.length} logo{folderUploadFiles.length > 1 ? 's' : ''}</h3>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Each filename becomes the brand name. Existing brands will get their logo updated.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => { setFolderUploadFiles([]); setUploadProgress([]); if (folderInputRef.current) folderInputRef.current.value = ''; }}
                        className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        disabled={isUploading}
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleFolderUpload}
                        className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        disabled={isUploading}
                      >
                        {isUploading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</> : <><UploadCloud size={16} /> Upload All</>}
                      </button>
                    </div>
                  </div>

                  {/* File list with progress */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '220px', overflowY: 'auto' }}>
                    {uploadProgress.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                        {item.status === 'pending'   && <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Waiting...</span>}
                        {item.status === 'uploading' && <Loader size={16} style={{ color: 'var(--primary-color)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
                        {item.status === 'done'      && <CheckCircle size={16} style={{ color: '#22c55e', flexShrink: 0 }} />}
                        {item.status === 'error'     && <span style={{ color: '#ef4444', fontSize: '0.75rem' }} title={item.error}><AlertCircle size={16} /></span>}
                      </div>
                    ))}
                  </div>

                  {/* Summary bar */}
                  {uploadProgress.some(p => p.status === 'done' || p.status === 'error') && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '0.85rem' }}>
                      ✅ {uploadProgress.filter(p => p.status === 'done').length} uploaded &nbsp;|&nbsp;
                      {uploadProgress.filter(p => p.status === 'error').length > 0 && <span style={{ color: '#ef4444' }}>❌ {uploadProgress.filter(p => p.status === 'error').length} failed</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Brand Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {brands.map(brand => (
                  <div key={brand.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenBrandModal(brand)} style={{ color: 'var(--text-secondary)' }}><Edit size={16}/></button>
                      <button onClick={() => handleDeleteBrand(brand.id)} style={{ color: '#ef4444' }}><Trash2 size={16}/></button>
                    </div>
                    <div style={{ height: '80px', width: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden' }}>
                      {brand.image_url
                        ? <img src={brand.image_url} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}/>
                        : <Tag size={32} color="var(--text-dim)" />}
                    </div>
                    <h3 style={{ textAlign: 'center', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{brand.name}</h3>
                    {brand.description && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{brand.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- TAB: CUSTOMERS ---- */}
          {activeTab === 'customers' && (
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', background: 'var(--surface-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Registered Customers <span style={{ color: 'var(--primary-color)', marginLeft: '0.5rem', fontSize: '1rem' }}>({customers.length})</span>
                </h2>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>These are customers who registered through the website.</span>
              </div>
              {customers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  No registrations yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '1rem 0.5rem' }}>#</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Email</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Phone</th>
                        <th style={{ padding: '1rem 0.5rem' }}>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c, i) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem 0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>{i + 1}</td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>{c.name}</td>
                          <td style={{ padding: '1rem 0.5rem' }}><a href={`mailto:${c.email}`} style={{ color: 'var(--primary-color)' }}>{c.email}</a></td>
                          <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{c.phone_number}</td>
                          <td style={{ padding: '1rem 0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                            {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ---- TAB: SETTINGS ---- */}
          {activeTab === 'settings' && (
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', background: 'var(--surface-color)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Site Settings</h2>
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(130,211,222,0.05)', border: '1px solid rgba(130,211,222,0.2)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '600', color: 'var(--primary-color)' }}>📧 Order Enquiry Email</label>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                    When a customer sends a cart enquiry from the website, it goes to this email address.
                  </p>
                  <input type="email" className="form-input" value={settings.enquiry_email || ''} onChange={e => setSettings({...settings, enquiry_email: e.target.value})} placeholder="mfurniturewala2007@gmail.com" />
                </div>
                <div style={{ height: '1px', background: 'var(--border-color)' }} />
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Goal / Headline</label>
                  <input type="text" className="form-input" value={settings.goal || ''} onChange={e => setSettings({...settings, goal: e.target.value})} placeholder="e.g. To provide the best tools globally." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full About Us Description</label>
                  <textarea className="form-input" rows="8" value={settings.about_text || ''} onChange={e => setSettings({...settings, about_text: e.target.value})} placeholder="Write the history and mission of Prompt Trading here..." />
                </div>
                <div>
                  <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                    {savingSettings ? 'Saving...' : 'Save All Settings'}
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
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface-color)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-xl)', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setIsBrandModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '2rem' }}>{editingBrandId ? 'Edit Brand' : 'Add Brand'}</h2>
            <form onSubmit={handleSaveBrand} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required type="text" className="form-input" placeholder="Brand Name" value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} />
              <textarea className="form-input" rows="2" placeholder="Description (Optional)" value={brandForm.description} onChange={e => setBrandForm({...brandForm, description: e.target.value})} />

              {/* Logo Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Brand Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={brandLogoFileRef}
                  style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files[0];
                    if (f) setBrandLogoFile(f);
                  }}
                />
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => brandLogoFileRef.current?.click()}>
                    <UploadCloud size={16} /> {brandLogoFile ? 'Change File' : 'Upload PNG'}
                  </button>
                  {brandLogoFile && <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>✓ {brandLogoFile.name}</span>}
                </div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Or paste a direct image URL:</label>
                <input type="text" className="form-input" placeholder="https://example.com/logo.png" value={brandForm.image_url} onChange={e => { setBrandForm({...brandForm, image_url: e.target.value}); setBrandLogoFile(null); }} />
              </div>

              {/* Logo Preview */}
              {(brandLogoFile || brandForm.image_url) && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Preview:</span>
                  <img
                    src={brandLogoFile ? URL.createObjectURL(brandLogoFile) : brandForm.image_url}
                    alt="Preview"
                    style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
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
