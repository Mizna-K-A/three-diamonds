'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const COLOR_OPTIONS = [
  'gray', 'red', 'green', 'blue', 'yellow', 
  'purple', 'orange', 'indigo', 'cyan', 'emerald'
];

const ICON_OPTIONS = [
  '📌', '✅', '⏳', '💰', '🔑', '⚫', '📝', '🏠', '❌', '🔜', '🏢', '🏷️',
  '⭐', '🔥', '✨', '🎯', '💎', '🚀', '💫', '🌟'
];

export default function PropertyStatusClient({ 
  initialStatuses,
  createPropertyStatus,
  updatePropertyStatus,
  deletePropertyStatus 
}) {
  const [statuses, setStatuses] = useState(initialStatuses || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    label: '',
    description: '',
    color: 'gray',
    icon: '📌',
    isDefault: false,
    isActive: true,
    sortOrder: 0,
  });

  // Filter statuses based on search
  const filteredStatuses = statuses.filter(status => {
    if (!status) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      status.name?.toLowerCase().includes(searchLower) ||
      status.label?.toLowerCase().includes(searchLower) ||
      status.description?.toLowerCase().includes(searchLower)
    );
  });

  // Sort statuses by sortOrder
  const sortedStatuses = [...filteredStatuses].sort((a, b) => 
    (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  const handleOpenModal = (status) => {
    if (status) {
      setEditingStatus(status);
      setFormData({
        name: status.name || '',
        slug: status.slug || '',
        label: status.label || '',
        description: status.description || '',
        color: status.color || 'gray',
        icon: status.icon || '📌',
        isDefault: status.isDefault || false,
        isActive: status.isActive !== false,
        sortOrder: status.sortOrder || 0,
      });
    } else {
      setEditingStatus(null);
      setFormData({
        name: '',
        slug: '',
        label: '',
        description: '',
        color: 'gray',
        icon: '📌',
        isDefault: false,
        isActive: true,
        sortOrder: statuses.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStatus(null);
    setFormData({
      name: '',
      slug: '',
      label: '',
      description: '',
      color: 'gray',
      icon: '📌',
      isDefault: false,
      isActive: true,
      sortOrder: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value.toString());
      });
      
      let result;
      
      if (editingStatus) {
        result = await updatePropertyStatus(editingStatus._id, formDataObj);
      } else {
        result = await createPropertyStatus(formDataObj);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update local state
      if (editingStatus) {
        setStatuses(types =>
          types.map(t => t._id === editingStatus._id ? result.data : t)
        );
      } else {
        setStatuses(types => [...types, result.data]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving property status:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property status?')) return;
    
    setIsLoading(true);
    
    try {
      const result = await deletePropertyStatus(id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setStatuses(types => types.filter(t => t._id !== id));
      
    } catch (error) {
      console.error('Error deleting property status:', error);
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
      label: formData.label || name, // Auto-fill label if empty
    });
  };

  const moveStatus = (index, direction) => {
    const newStatuses = [...statuses];
    const temp = newStatuses[index];
    newStatuses[index] = newStatuses[index + direction];
    newStatuses[index + direction] = temp;
    
    // Update sortOrder
    newStatuses.forEach((status, i) => {
      status.sortOrder = i;
    });
    
    setStatuses(newStatuses);
  };

  const getColorClass = (color) => {
    const colorMap = {
      gray: 'bg-gray-900 text-gray-300',
      red: 'bg-red-900 text-red-300',
      green: 'bg-green-900 text-green-300',
      blue: 'bg-blue-900 text-blue-300',
      yellow: 'bg-yellow-900 text-yellow-300',
      purple: 'bg-purple-900 text-purple-300',
      orange: 'bg-orange-900 text-orange-300',
      indigo: 'bg-indigo-900 text-indigo-300',
      cyan: 'bg-cyan-900 text-cyan-300',
      emerald: 'bg-emerald-900 text-emerald-300',
    };
    return colorMap[color] || 'bg-gray-900 text-gray-300';
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
        <h1 className="text-2xl font-bold text-white mb-2">Property Statuses</h1>
        <p className="text-gray-400">Manage property status options</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search statuses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-700"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Plus size={18} />
          <span>Add Status</span>
        </button>
      </div>

      {/* Statuses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedStatuses.map((status, index) => (
          <div
            key={status._id}
            className={`${getColorClass(status.color)} rounded-xl border border-gray-800 p-4 ${
              !status.isActive ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{status.icon}</span>
                <div>
                  <h3 className="font-semibold">{status.label}</h3>
                  <p className="text-sm opacity-75">{status.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveStatus(index, -1)}
                  disabled={index === 0}
                  className="p-1 hover:bg-black/20 rounded disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => moveStatus(index, 1)}
                  disabled={index === sortedStatuses.length - 1}
                  className="p-1 hover:bg-black/20 rounded disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-sm mb-3 opacity-75">{status.description}</p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-black/20 rounded">
                  Order: {status.sortOrder}
                </span>
                {status.isDefault && (
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded">
                    Default
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(status)}
                  className="p-1 hover:bg-black/20 rounded"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(status._id)}
                  className="p-1 hover:bg-black/20 rounded text-red-300"
                  disabled={status.isDefault}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sortedStatuses.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-3">📊</div>
            <p className="text-gray-500">No property statuses found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111111] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {editingStatus ? 'Edit Property Status' : 'Add Property Status'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                    required
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
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Display Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                  >
                    {COLOR_OPTIONS.map(color => (
                      <option key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                  />
                </div>

                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-800 bg-[#0a0a0a]"
                    />
                    Default Status
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-800 bg-[#0a0a0a]"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                >
                  {editingStatus ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}