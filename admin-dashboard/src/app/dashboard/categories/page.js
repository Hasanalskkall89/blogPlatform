'use client';

import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import CategoryForm from '@/components/CategoryForm';
import Loader from '@/components/Loader';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { fetchWithAuth } = useAuth();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreateCategory = async (categoryData) => {
    const response = await fetchWithAuth(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    await fetchCategories();
    setIsFormOpen(false);
  };

  const handleUpdateCategory = async (categoryData) => {
    const response = await fetchWithAuth(`${API_URL}/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to update category');
    await fetchCategories();
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const response = await fetchWithAuth(`${API_URL}/categories/${categoryId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete category');
      await fetchCategories();
    } catch (err) {
      alert(err.message || 'Error deleting category');
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
        <button onClick={() => fetchCategories()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Manage Categories</h1>
        <button
          onClick={() => { setEditingCategory(null); setIsFormOpen(true); }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all"
        >
          <HiPlus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-md">
            <CategoryForm
              initialData={editingCategory}
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
              onCancel={() => { setIsFormOpen(false); setEditingCategory(null); }}
            />
          </div>
        </div>
      )}

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">{category.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{category.post_count || 0} articles</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditingCategory(category); setIsFormOpen(true); }} className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg">
                <HiPencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category Name</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Article Count</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{category.post_count || 0}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingCategory(category); setIsFormOpen(true); }} className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">No categories yet</div>
      )}
    </div>
  );
}

