import React, { useState, useEffect } from 'react';
import { adminApiCall } from '../../utils/adminApi';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    brand: '',
    stockQuantity: '',
    inStock: true,
    isNew: false,
    isDeal: false,
    images: [],
    specifications: {},
    variations: []
  });
  const [varColor, setVarColor] = useState('');
  const [varRam, setVarRam] = useState('');
  const [varRom, setVarRom] = useState('');
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const res = await adminApiCall('/api/products?limit=100');
      setProducts(res.data?.products || res.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await adminApiCall('/api/categories');
      const cats = res.data?.categories || res.categories || [];
      const flat = [];
      cats.forEach(cat => {
        flat.push(cat);
        if (cat.subcategories) {
          cat.subcategories.forEach(sub => flat.push(sub));
        }
      });
      setCategories(flat);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalStock = formData.variations.length > 0
        ? formData.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
        : parseInt(formData.stockQuantity);
      
      const data = {
        ...formData,
        price: parseInt(formData.price),
        originalPrice: parseInt(formData.originalPrice),
        stockQuantity: totalStock
      };

      if (editingProduct) {
        await adminApiCall(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      } else {
        await adminApiCall('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({...formData, images: [...formData.images, imageInput.trim()]});
      setImageInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await adminApiCall('/api/admin/upload', {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });

      setFormData(prev => ({...prev, images: [...prev.images, res.url]}));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData({...formData, images: formData.images.filter((_, i) => i !== index)});
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData({...formData, specifications: {...formData.specifications, [specKey]: specValue}});
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = {...formData.specifications};
    delete newSpecs[key];
    setFormData({...formData, specifications: newSpecs});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminApiCall(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      categoryId: product.categoryId,
      brand: product.brand,
      stockQuantity: product.stockQuantity,
      inStock: product.inStock,
      isNew: product.isNew,
      isDeal: product.isDeal,
      images: product.images || [],
      specifications: product.specifications || {},
      variations: product.variations || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      brand: '',
      stockQuantity: '',
      inStock: true,
      isNew: false,
      isDeal: false,
      images: [],
      specifications: {},
      variations: []
    });
    setImageInput('');
    setSpecKey('');
    setSpecValue('');
    setVarColor('');
    setVarRam('');
    setVarRom('');
    setVarPrice('');
    setVarStock('');
  };

  const addVariation = () => {
    if (varColor.trim()) {
      const variation = {
        color: varColor.trim(),
        ram: varRam.trim(),
        rom: varRom.trim(),
        price: varPrice ? parseInt(varPrice) : parseInt(formData.price),
        stock: varStock ? parseInt(varStock) : 0
      };
      setFormData({...formData, variations: [...formData.variations, variation]});
      setVarColor('');
      setVarRam('');
      setVarRom('');
      setVarPrice('');
      setVarStock('');
    }
  };

  const removeVariation = (index) => {
    setFormData({...formData, variations: formData.variations.filter((_, i) => i !== index)});
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded w-64"
          />
          <button
            onClick={() => { setShowForm(true); setEditingProduct(null); resetForm(); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit' : 'Add'} Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="border p-2 rounded col-span-2"
              rows="3"
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Original Price"
              value={formData.originalPrice}
              onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
              className="border p-2 rounded"
            />
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {(categories || []).map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentId ? `  ↳ ${cat.name}` : cat.name}
                </option>
              ))}
            </select>
            {formData.variations.length === 0 && (
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                className="border p-2 rounded"
                required
              />
            )}
            {formData.variations.length > 0 && (
              <div className="border p-2 rounded bg-gray-50 flex items-center">
                <span className="text-gray-600">Total Stock: {formData.variations.reduce((sum, v) => sum + (v.stock || 0), 0)}</span>
              </div>
            )}
            <div className="col-span-2">
              <label className="block font-medium mb-2">Product Images</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="border p-2 rounded flex-1"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Or paste image URL"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add URL
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt="" className="w-20 h-20 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block font-medium mb-2">Specifications</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Key (e.g., RAM)"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="text"
                  placeholder="Value (e.g., 8GB)"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span><strong>{key}:</strong> {value}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block font-medium mb-2">Product Variations (Color, RAM, ROM)</label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Color"
                  value={varColor}
                  onChange={(e) => setVarColor(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="RAM (e.g., 8GB)"
                  value={varRam}
                  onChange={(e) => setVarRam(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="ROM (e.g., 128GB)"
                  value={varRom}
                  onChange={(e) => setVarRom(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Price (optional)"
                  value={varPrice}
                  onChange={(e) => setVarPrice(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={varStock}
                  onChange={(e) => setVarStock(e.target.value)}
                  className="border p-2 rounded"
                />
              </div>
              <button
                type="button"
                onClick={addVariation}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-2"
              >
                Add Variation
              </button>
              <div className="space-y-1">
                {formData.variations.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded gap-2">
                    <span className="flex-1">
                      <strong>{v.color}</strong>
                      {v.ram && ` | RAM: ${v.ram}`}
                      {v.rom && ` | ROM: ${v.rom}`}
                      {v.price && ` | Price: BDT ${v.price}`}
                    </span>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => {
                        const newVars = [...formData.variations];
                        newVars[idx].stock = parseInt(e.target.value) || 0;
                        setFormData({...formData, variations: newVars});
                      }}
                      className="border p-1 rounded w-20 text-center"
                      placeholder="Stock"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariation(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                  className="mr-2"
                />
                In Stock
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                  className="mr-2"
                />
                New Product
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDeal}
                  onChange={(e) => setFormData({...formData, isDeal: e.target.checked})}
                  className="mr-2"
                />
                Deal
              </label>
            </div>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editingProduct ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingProduct(null); }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(filteredProducts || []).map(product => (
              <tr key={product.id} className="border-b">
                <td className="p-3">
                  <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category?.name}</td>
                <td className="p-3">BDT {product.price.toLocaleString()}</td>
                <td className="p-3">{product.stockQuantity}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
