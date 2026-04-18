import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Edit, Trash2, UploadCloud, X, Search, Settings, Tag, Package, FolderUp, CheckCircle, AlertCircle, Loader, Users, Mail } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabase';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const fileInputRef = useRef(null);
  const brandFileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'brands', 'customers', 'enquiries', 'settings'
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState('');

  // Products State
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', part_number: '', price: '', quantity_in_stock: '', brand: '', sub_brand: '', category: '', image_url: '' });

  // Bulk Actions State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState({ 
    field: 'quantity_in_stock', // 'quantity_in_stock' or 'price'
    operation: 'add',           // 'add', 'set', 'percent'
    value: 0, 
    targetType: 'all',          // 'all', 'brand', 'category'
    targetValue: ''             // e.g. "DeWalt" or "Power Tools"
  });

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
  const [searchCustomer, setSearchCustomer] = useState('');

  // Enquiries State
  const [enquiries, setEnquiries] = useState([]);
  const [searchEnquiry, setSearchEnquiry] = useState('');

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
      } else if (activeTab === 'enquiries') {
        const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setEnquiries(data || []);
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

  const handleInlineUpdate = async (id, field, value) => {
    const { error } = await supabase.from('products').update({ [field]: value }).eq('id', id);
    if (error) {
      alert("Error updating: " + error.message);
    } else {
      // Opt: We could fetchAllData(), but to keep UI fast, we just update local state
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    }
  };

  const handleBulkActionExecute = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to apply this bulk update to ${bulkAction.targetType === 'all' ? 'ALL products' : `products matching "${bulkAction.targetValue}"`}?`)) return;

    // Fetch products based on filter
    let query = supabase.from('products').select('*');
    if (bulkAction.targetType === 'brand') query = query.ilike('brand', `%${bulkAction.targetValue}%`);
    if (bulkAction.targetType === 'category') query = query.ilike('category', `%${bulkAction.targetValue}%`);
    
    const { data: targetProducts, error: fetchError } = await query;
    if (fetchError || !targetProducts || targetProducts.length === 0) {
      alert("No products found matching that criteria or database error.");
      return;
    }

    const val = parseFloat(bulkAction.value);
    
    const updates = targetProducts.map(p => {
      let newValue = parseFloat(p[bulkAction.field]) || 0;
      if (bulkAction.operation === 'add') newValue += val;
      if (bulkAction.operation === 'set') newValue = val;
      if (bulkAction.operation === 'percent') newValue = newValue * (1 + (val / 100));
      
      if (bulkAction.field === 'quantity_in_stock') newValue = Math.max(0, Math.round(newValue));
      if (bulkAction.field === 'price') newValue = Math.max(0, newValue);

      return { ...p, [bulkAction.field]: newValue };
    });

    const { error: updateError } = await supabase.from('products').upsert(updates, { onConflict: 'id' });
    if (updateError) {
      alert("Error updating products: " + updateError.message);
    } else {
      alert(`Successfully updated ${updates.length} products.`);
      setIsBulkModalOpen(false);
      fetchAllData();
    }
  };

  const handleDeleteAllProducts = async () => {
    if (window.confirm("WARNING: Are you sure you want to delete ALL tools from the inventory? This action cannot be undone.")) {
      // Supabase trick to delete all rows: provide a filter that matches everything, like neq('id', null) or greater than.
      // Easiest is to use an inequality filter on a known column.
      const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        alert("Error deleting all tools: " + error.message);
      } else {
        alert("All tools have been deleted.");
        fetchAllData();
      }
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

        const { data: existingProducts } = await supabase.from('products').select('*');
        const existingMap = new Map((existingProducts || []).map(p => [p.part_number, p]));

        const upsertDataMap = new Map();

        data.forEach(item => {
          let part_number = String(item['Part Number'] || item.part_number || item['Part number'] || '').trim();
          
          // If the item in Excel has no part number, give it a random unique one so it doesn't collide
          if (!part_number) {
            part_number = 'UNK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
          }

          const existing = existingMap.get(part_number);

          const getName = () => item['Tool Name'] || item.name || item.Name || item['Product Name'];
          const getPrice = () => item.price !== undefined ? item.price : (item.Price !== undefined ? item.Price : item.Cost);
          const getQty = () => item['Quantity in Stock'] !== undefined ? item['Quantity in Stock'] : (item.quantity !== undefined ? item.quantity : item.Quantity);
          const getBrand = () => item.Brand || item.brand;
          const getSubBrand = () => item['Sub-Brand'] || item.sub_brand || item.subbrand;
          const getCat = () => item['Tool Category'] || item.category || item.Category;
          const getImg = () => item.image_url || item['Image URL'] || item.imageUrl;

          let recordObj;

          if (existing) {
            // Update existing record
            recordObj = {
              id: existing.id,
              part_number: existing.part_number,
              name: getName() !== undefined ? getName() : existing.name,
              price: getPrice() !== undefined ? parseFloat(getPrice() || 0) : existing.price,
              quantity_in_stock: getQty() !== undefined ? parseInt(getQty() || 0) : existing.quantity_in_stock,
              brand: getBrand() !== undefined ? getBrand() : existing.brand,
              sub_brand: getSubBrand() !== undefined ? getSubBrand() : existing.sub_brand,
              category: getCat() !== undefined ? getCat() : existing.category,
              image_url: getImg() !== undefined ? getImg() : existing.image_url
            };
          } else {
            // Insert new record
            recordObj = {
              name: getName() || 'Unknown Product',
              part_number: part_number,
              price: parseFloat(getPrice() || 0) || 0,
              quantity_in_stock: parseInt(getQty() || 0) || 0,
              brand: getBrand() || 'Unknown Brand',
              sub_brand: getSubBrand() || '',
              category: getCat() || 'General',
              image_url: getImg() || ''
            };
          }

          // Important: Saving it into a Map keyed by `part_number` means if the Excel sheet 
          // has two rows with the EXACT SAME Part Number, it will just overwrite the first 
          // one with the second one instead of trying to upload both and crashing the DB!
          upsertDataMap.set(part_number, recordObj);
        });

        const upsertData = Array.from(upsertDataMap.values());

        // Use upsert matching on ID (for existing) and letting DB generated ID for new ones
        const { error } = await supabase.from('products').upsert(upsertData, { onConflict: 'id' });
        if (error) {
           console.error(error);
           alert("Error uploading data to database: " + error.message);
        } else {
           alert(`Successfully imported/updated ${upsertData.length} products!`);
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
          onClick={() => setActiveTab('enquiries')} 
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', color: activeTab === 'enquiries' ? 'white' : 'var(--text-secondary)', background: activeTab === 'enquiries' ? 'var(--primary-color)' : 'transparent', transition: 'var(--transition)' }}
        >
          <Mail size={20} /> Tool Enquiries
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
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="text" className="form-input" placeholder="Search products..." style={{ paddingLeft: '2.5rem' }} value={searchProduct} onChange={e => setSearchProduct(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                  <button className="btn btn-outline" onClick={() => setIsBulkModalOpen(true)}>
                    <Settings size={20} /> Bulk Actions
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
                  {products.filter(p => p.name?.toLowerCase().includes(searchProduct.toLowerCase()) || p.part_number?.toLowerCase().includes(searchProduct.toLowerCase())).map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>
                        <div>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{product.part_number}</div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{product.brand} {product.sub_brand && `(${product.sub_brand})`}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{product.category}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <input 
                          type="number" 
                          defaultValue={product.quantity_in_stock}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (val !== product.quantity_in_stock && !isNaN(val)) handleInlineUpdate(product.id, 'quantity_in_stock', val);
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                          className="form-input" 
                          style={{ width: '80px', padding: '0.25rem 0.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }} 
                        />
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ color: 'var(--text-dim)' }}>₹</span>
                          <input 
                            type="number" 
                            step="0.01"
                            defaultValue={product.price}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (val !== product.price && !isNaN(val)) handleInlineUpdate(product.id, 'price', val);
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                            className="form-input" 
                            style={{ width: '100px', padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.02)' }} 
                          />
                        </div>
                      </td>
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
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
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
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
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
                      {customers.filter(c => 
                        c.name?.toLowerCase().includes(searchCustomer.toLowerCase()) || 
                        c.email?.toLowerCase().includes(searchCustomer.toLowerCase())
                      ).map((c, i) => (
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

          {/* ---- TAB: ENQUIRIES ---- */}
          {activeTab === 'enquiries' && (
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Tool Enquiries <span style={{ color: 'var(--primary-color)', marginLeft: '0.5rem', fontSize: '1rem' }}>({enquiries.length})</span>
                </h2>
                <div style={{ position: 'relative', width: '300px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input type="text" className="form-input" placeholder="Search enquiries..." style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }} value={searchEnquiry} onChange={e => setSearchEnquiry(e.target.value)} />
                </div>
              </div>

              {enquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  No enquiries yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {enquiries.filter(e => 
                    e.customer_name?.toLowerCase().includes(searchEnquiry.toLowerCase()) || 
                    e.customer_email?.toLowerCase().includes(searchEnquiry.toLowerCase()) ||
                    JSON.stringify(e.items).toLowerCase().includes(searchEnquiry.toLowerCase())
                  ).map((enquiry) => (
                    <div key={enquiry.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-color)' }}>{enquiry.customer_name}</h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {enquiry.customer_email} • {enquiry.customer_phone}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                            {new Date(enquiry.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                          <span style={{ 
                            display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.6rem', 
                            fontSize: '0.7rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 800,
                            background: enquiry.status === 'pending' ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.1)',
                            color: enquiry.status === 'pending' ? '#fb923c' : '#4ade80'
                          }}>
                            {enquiry.status}
                          </span>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Requested Items</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {enquiry.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                              <span>{item.name} <small style={{ color: 'var(--text-dim)' }}>({item.brand})</small> × {item.quantity}</span>
                              <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.5rem', fontWeight: 700, fontSize: '1rem', color: 'var(--primary-color)' }}>
                          <span>Total Estimated Amount</span>
                          <span>₹{enquiry.total_amount?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---- TAB: SETTINGS ---- */}
          {activeTab === 'settings' && (
            <div className="glass animate-fade-in-up" style={{ borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
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

      {/* Bulk Actions Modal */}
      {isBulkModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--surface-color)', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-xl)', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsBulkModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}><X size={24} /></button>
            <h2 style={{ marginBottom: '2rem' }}>Advanced Bulk Actions</h2>
            <form onSubmit={handleBulkActionExecute} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Target Selection */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>1. Which Products?</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <label><input type="radio" value="all" checked={bulkAction.targetType === 'all'} onChange={e => setBulkAction({...bulkAction, targetType: e.target.value})} /> All Products</label>
                  <label><input type="radio" value="brand" checked={bulkAction.targetType === 'brand'} onChange={e => setBulkAction({...bulkAction, targetType: e.target.value})} /> Specific Brand</label>
                  <label><input type="radio" value="category" checked={bulkAction.targetType === 'category'} onChange={e => setBulkAction({...bulkAction, targetType: e.target.value})} /> Specific Category</label>
                </div>
                {bulkAction.targetType !== 'all' && (
                  <input required type="text" className="form-input" placeholder={`Enter ${bulkAction.targetType} name...`} value={bulkAction.targetValue} onChange={e => setBulkAction({...bulkAction, targetValue: e.target.value})} />
                )}
              </div>

              {/* Action Selection */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>2. What to Change?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <select className="form-input" value={bulkAction.field} onChange={e => setBulkAction({...bulkAction, field: e.target.value})}>
                    <option value="quantity_in_stock">Quantity in Stock</option>
                    <option value="price">Price (Rate)</option>
                  </select>
                  <select className="form-input" value={bulkAction.operation} onChange={e => setBulkAction({...bulkAction, operation: e.target.value})}>
                    <option value="add">Add ( + )</option>
                    <option value="set">Set to Exact Number</option>
                    <option value="percent">Increase by Percent (%)</option>
                  </select>
                  <input required type="number" step="0.01" className="form-input" placeholder="Value..." value={bulkAction.value} onChange={e => setBulkAction({...bulkAction, value: e.target.value})} style={{ gridColumn: '1 / -1' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button type="button" onClick={handleDeleteAllProducts} className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                  <Trash2 size={16} /> Delete Entire Inventory
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsBulkModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: 'var(--primary-color)' }}>Execute Bulk Action</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
