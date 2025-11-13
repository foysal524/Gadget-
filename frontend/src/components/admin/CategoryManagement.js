import React, { useState, useEffect } from 'react';
import { adminApiCall } from '../../utils/adminApi';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', parentId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingSubTo, setAddingSubTo] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminApiCall('/api/categories');
      setCategories(res.data?.categories || res.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleEdit = (category) => {
    setEditingCategory(category.id);
    setFormData({ name: category.name, image: category.image, parentId: category.parentId });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '', parentId: null });
  };

  const handleSaveEdit = async (categoryId) => {
    try {
      await adminApiCall(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: formData.name, image: formData.image })
      });
      setEditingCategory(null);
      setFormData({ name: '', image: '', parentId: null });
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleAddSubcategory = (parentId, parentName) => {
    setAddingSubTo({ id: parentId, name: parentName });
    setFormData({ name: '', image: '', parentId });
    setShowAddForm(true);
  };

  const handleAddTopLevel = () => {
    setAddingSubTo(null);
    setFormData({ name: '', image: '', parentId: null });
    setShowAddForm(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await adminApiCall('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (formData.parentId) {
        setExpandedCategories(prev => ({ ...prev, [formData.parentId]: true }));
      }
      setShowAddForm(false);
      setAddingSubTo(null);
      setFormData({ name: '', image: '', parentId: null });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminApiCall(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filterCategories = (cats) => {
    if (!searchTerm) return cats;
    return cats.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingSubcategory = cat.subcategories?.some(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesSearch || hasMatchingSubcategory;
    });
  };

  const renderCategory = (category, level = 0) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories[category.id];
    const isEditing = editingCategory === category.id;
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      <div key={category.id} style={{ marginLeft: `${level * 24}px` }}>
        <div className={`flex items-center justify-between p-3 border-b hover:bg-gray-50 ${
          searchTerm && !matchesSearch ? 'opacity-50' : ''
        }`}>
          <div className="flex items-center gap-2 flex-1">
            {hasSubcategories && (
              <button onClick={() => toggleExpand(category.id)} className="text-gray-600">
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            {!hasSubcategories && <span className="w-6"></span>}
            
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border px-2 py-1 rounded flex-1"
                autoFocus
              />
            ) : (
              <span className="font-medium">{category.name}</span>
            )}
            <span className="text-sm text-gray-500">({category.productCount} products)</span>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSaveEdit(category.id)}
                  className="text-green-600 hover:underline text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:underline text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAddSubcategory(category.id, category.name)}
                  className="text-green-600 hover:underline text-sm"
                  title="Add Subcategory"
                >
                  + Sub
                </button>
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        
        {hasSubcategories && isExpanded && (
          <div>
            {(category.subcategories || []).map(sub => renderCategory(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Category Manager</h1>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-lg w-64"
          />
        </div>
        <button
          onClick={handleAddTopLevel}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Top-Level Category
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {addingSubTo ? `Add Subcategory to ${addingSubTo.name}` : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border px-3 py-2 rounded-lg"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Create
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setAddingSubTo(null); }}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {filterCategories(categories || []).map(category => renderCategory(category))}
      </div>
    </div>
  );
};

export default CategoryManagement;
