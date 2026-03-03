'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  FolderTree,
  Tag as TagIcon,
} from 'lucide-react';

const COLOR_OPTIONS = [
  'gray', 'red', 'green', 'blue', 'yellow', 
  'purple', 'orange', 'indigo', 'cyan', 'emerald',
  'pink', 'amber'
];

const ICON_OPTIONS = [
  '🏷️', '🏠', '💰', '🔑', '📝', '⭐', '🔥', '✨', '🎯', '💎',
  '🚀', '💫', '🌟', '💵', '🏢', '🌴', '🏊', '🌳', '🏔️', '🌅',
  '🏙️', '🏘️', '🛋️', '🛏️', '🚗', '🌡️', '❄️', '🔥', '🌿', '🏋️'
];

export default function TagsClient({ 
  initialTags,
  tagsByCategory,
  usageCounts,
  categoryOptions,
  createTag,
  updateTag,
  deleteTag 
}) {
  const [tags, setTags] = useState(initialTags || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('PURPOSE');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    label: '',
    description: '',
    category: 'PURPOSE',
    color: 'gray',
    icon: '🏷️',
    isDefault: false,
    isActive: true,
    sortOrder: 0,
    parentId: '',
    metadata: '',
  });

  // Filter tags based on search
  const filteredTags = tags.filter(tag => {
    if (!tag) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      tag.name?.toLowerCase().includes(searchLower) ||
      tag.label?.toLowerCase().includes(searchLower) ||
      tag.description?.toLowerCase().includes(searchLower)
    );
  });

  // Get parent options for selected category
  const parentOptions = tags
    .filter(t => t.category === formData.category && t._id !== editingTag?._id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

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
      pink: 'bg-pink-900 text-pink-300',
      amber: 'bg-amber-900 text-amber-300',
    };
    return colorMap[color] || 'bg-gray-900 text-gray-300';
  };

  const handleOpenModal = (tag) => {
    if (tag) {
      setEditingTag(tag);
      setSelectedCategory(tag.category);
      setFormData({
        name: tag.name || '',
        slug: tag.slug || '',
        label: tag.label || '',
        description: tag.description || '',
        category: tag.category || 'PURPOSE',
        color: tag.color || 'gray',
        icon: tag.icon || '🏷️',
        isDefault: tag.isDefault || false,
        isActive: tag.isActive !== false,
        sortOrder: tag.sortOrder || 0,
        parentId: tag.parentId || '',
        metadata: tag.metadata ? JSON.stringify(tag.metadata, null, 2) : '',
      });
    } else {
      setEditingTag(null);
      setSelectedCategory('PURPOSE');
      setFormData({
        name: '',
        slug: '',
        label: '',
        description: '',
        category: 'PURPOSE',
        color: 'gray',
        icon: '🏷️',
        isDefault: false,
        isActive: true,
        sortOrder: tags.filter(t => t.category === 'PURPOSE').length,
        parentId: '',
        metadata: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setFormData({
      name: '',
      slug: '',
      label: '',
      description: '',
      category: 'PURPOSE',
      color: 'gray',
      icon: '🏷️',
      isDefault: false,
      isActive: true,
      sortOrder: 0,
      parentId: '',
      metadata: '',
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
      
      if (editingTag) {
        result = await updateTag(editingTag._id, formDataObj);
      } else {
        result = await createTag(formDataObj);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Refresh the page or update local state
      if (editingTag) {
        setTags(prev => prev.map(t => t._id === editingTag._id ? result.data : t));
      } else {
        setTags(prev => [...prev, result.data]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    
    setIsLoading(true);
    
    try {
      const result = await deleteTag(id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setTags(prev => prev.filter(t => t._id !== id));
      
    } catch (error) {
      console.error('Error deleting tag:', error);
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
      label: formData.label || name,
    });
  };

  // Get tags for current category
  const currentCategoryTags = filteredTags.filter(t => t.category === selectedCategory);

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
        <h1 className="text-2xl font-bold text-white mb-2">Property Tags</h1>
        <p className="text-gray-400">Manage property tags like "For Sale", "For Rent", "Lease", and more</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categoryOptions.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.value
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search tags..."
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
          <span>Add Tag</span>
        </button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCategoryTags.map((tag) => {
          const usageCount = usageCounts[tag._id] || 0;
          
          return (
            <div
              key={tag._id}
              className={`${getColorClass(tag.color)} rounded-xl border border-gray-800 p-4 ${
                !tag.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tag.icon}</span>
                  <div>
                    <h3 className="font-semibold">{tag.label}</h3>
                    <p className="text-sm opacity-75">{tag.name}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm mb-3 opacity-75 line-clamp-2">{tag.description}</p>
              
              {tag.parentName && (
                <div className="flex items-center gap-1 text-xs mb-2 opacity-75">
                  <FolderTree size={12} />
                  <span>Parent: {tag.parentLabel || tag.parentName}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-black/20 rounded">
                    Order: {tag.sortOrder}
                  </span>
                  {tag.isDefault && (
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded">
                      Default
                    </span>
                  )}
                  {usageCount > 0 && (
                    <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded">
                      {usageCount} used
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(tag)}
                    className="p-1 hover:bg-black/20 rounded"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag._id)}
                    className="p-1 hover:bg-black/20 rounded text-red-300"
                    disabled={tag.isDefault || usageCount > 0}
                    title={tag.isDefault ? "Default tags cannot be deleted" : usageCount > 0 ? "Tag is in use" : ""}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {currentCategoryTags.length === 0 && (
          <div className="col-span-full text-center py-12">
            <TagIcon size={48} className="mx-auto text-gray-700 mb-3" />
            <p className="text-gray-500">No tags found in this category</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add your first tag</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111111] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {editingTag ? 'Edit Tag' : 'Add New Tag'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name *
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
                    Slug *
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
                  Display Label *
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
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        category: e.target.value,
                        parentId: '' // Reset parent when category changes
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                    required
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Parent Tag
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white"
                  >
                    <option value="">None (Top Level)</option>
                    {parentOptions.map(parent => (
                      <option key={parent._id} value={parent._id}>
                        {parent.label} ({parent.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Metadata (JSON)
                </label>
                <textarea
                  value={formData.metadata}
                  onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded border-gray-800 bg-[#0a0a0a]"
                  />
                  Default for Category
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
                  {editingTag ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}