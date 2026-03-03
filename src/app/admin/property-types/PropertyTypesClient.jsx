'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
} from 'lucide-react';

export default function PropertyTypesClient({ 
  initialPropertyTypes,
  createPropertyType,
  updatePropertyType,
  deletePropertyType 
}) {
  const [propertyTypes, setPropertyTypes] = useState(initialPropertyTypes || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
  });

  // Filter property types based on search
  const filteredTypes = propertyTypes.filter(type => {
    if (!type) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = type.name?.toLowerCase().includes(searchLower);
    const descriptionMatch = type.description?.toLowerCase().includes(searchLower);
    
    return nameMatch || descriptionMatch;
  });

  const handleOpenModal = (type) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name || '',
        slug: type.slug || '',
        description: type.description || '',
        icon: type.icon || '',
      });
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('slug', formData.slug);
      formDataObj.append('description', formData.description);
      formDataObj.append('icon', formData.icon);
      
      let result;
      
      if (editingType) {
        result = await updatePropertyType(editingType._id, formDataObj);
      } else {
        result = await createPropertyType(formDataObj);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update local state
      if (editingType) {
        setPropertyTypes(types =>
          types.map(t => t._id === editingType._id ? result.data : t)
        );
      } else {
        setPropertyTypes(types => [...types, result.data]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving property type:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const typeToDelete = propertyTypes.find(t => t._id === id);
    
    if (typeToDelete?.propertyCount > 0) {
      if (!confirm(`This property type has ${typeToDelete.propertyCount} properties. Deleting it will remove the type from these properties. Continue?`)) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this property type?')) return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await deletePropertyType(id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update local state
      setPropertyTypes(types => types.filter(t => t._id !== id));
      
    } catch (error) {
      console.error('Error deleting property type:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Property Types</h1>
        <p className="text-gray-400">Manage property categories and classifications</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search property types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-700"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span>Add Property Type</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Properties
              </th>
              <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredTypes.map((type) => (
              <tr key={type._id} className="hover:bg-gray-800/20 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      {type.icon ? (
                        <span className="text-gray-400">{type.icon}</span>
                      ) : (
                        <Building2 size={16} className="text-gray-500" />
                      )}
                    </div>
                    <span className="text-white font-medium">{type.name || 'Unnamed'}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-400">{type.slug || '—'}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-400 line-clamp-1">
                    {type.description || '—'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-400">
                    {type.propertyCount || 0} properties
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(type)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(type._id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTypes.length === 0 && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-700 mb-3" />
            <p className="text-gray-500">No property types found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111111] border border-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {editingType ? 'Edit Property Type' : 'Add Property Type'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Icon (emoji or icon name)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                  placeholder="e.g., 🏠 or Building2"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : (editingType ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}