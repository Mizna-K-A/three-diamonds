'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building2,
  ChevronDown,
  X,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Swal from 'sweetalert2';

// Known non-icon exports to exclude
const EXCLUDED = new Set(['createLucideIcon', 'default', 'icons']);

// Lucide icons always have a displayName set (e.g. "Home", "Building2")
// This is the most reliable way to distinguish them from utility exports
const ALL_ICONS = Object.entries(LucideIcons).filter(([name, Component]) => {
  if (EXCLUDED.has(name)) return false;
  if (!/^[A-Z]/.test(name)) return false;
  if (!Component) return false;
  // All lucide icons have displayName matching their export name
  return Component.displayName === name || typeof Component.render === 'function' || typeof Component === 'function';
});

// Debug: log to console so you can verify in your browser
if (typeof window !== 'undefined') {
  console.log('[IconPicker] Loaded icons count:', ALL_ICONS.length, ALL_ICONS.slice(0, 5).map(([n]) => n));
}

function SafeIcon({ Component, size, className }) {
  try {
    return <Component size={size} className={className} />;
  } catch {
    return null;
  }
}

function IconPickerDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_ICONS.slice(0, 80);
    const q = search.toLowerCase();
    return ALL_ICONS.filter(([name]) => name.toLowerCase().includes(q)).slice(0, 80);
  }, [search]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const SelectedIcon = value && LucideIcons[value] ? LucideIcons[value] : null;

  const handleSelect = (name) => {
    onChange(name);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600 hover:border-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2 flex-1 min-w-0">
          {SelectedIcon ? (
            <>
              <SelectedIcon size={16} className="text-gray-300 shrink-0" />
              <span className="text-sm text-gray-300 truncate">{value}</span>
            </>
          ) : (
            <span className="text-sm text-gray-600">Select an icon...</span>
          )}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-gray-700 cursor-pointer"
            >
              <X size={12} className="text-gray-500" />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#111111] border border-gray-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-800">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                autoFocus
                type="text"
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600"
              />
            </div>
          </div>

          {/* Icon grid */}
          <div className="p-2 grid grid-cols-8 gap-1 max-h-52 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 && (
              <div className="col-span-8 text-center py-6 text-gray-600 text-sm">
                No icons found
              </div>
            )}
            {filtered.map(([name, IconComp]) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => handleSelect(name)}
                className={`
                  flex items-center justify-center p-2 rounded-lg transition-colors
                  ${value === name
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <SafeIcon Component={IconComp} size={16} />
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="px-3 py-1.5 border-t border-gray-800 text-xs text-gray-600">
            {search.trim()
              ? `Showing ${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
              : `Showing 80 of ${ALL_ICONS.length} icons — search to filter`}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertyTypesClient({
  initialPropertyTypes,
  createPropertyType,
  updatePropertyType,
  deletePropertyType,
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

  const filteredTypes = propertyTypes.filter((type) => {
    if (!type) return false;
    const q = searchTerm.toLowerCase();
    return type.name?.toLowerCase().includes(q) || type.description?.toLowerCase().includes(q);
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
      setFormData({ name: '', slug: '', description: '', icon: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: '', slug: '', description: '', icon: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('slug', formData.slug);
      fd.append('description', formData.description);
      fd.append('icon', formData.icon);

      let result;
      if (editingType) {
        result = await updatePropertyType(editingType._id, fd);
      } else {
        result = await createPropertyType(fd);
      }

      if (result.error) throw new Error(result.error);

      if (editingType) {
        setPropertyTypes((types) =>
          types.map((t) => (t._id === editingType._id ? result.data : t))
        );
        
        // Show success message for update
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Property type has been updated successfully.',
          timer: 2000,
          showConfirmButton: false,
          background: '#111111',
          color: '#ffffff',
          customClass: {
            popup: 'border border-gray-800 rounded-xl'
          }
        });
      } else {
        setPropertyTypes((types) => [...types, result.data]);
        
        // Show success message for creation
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Property type has been created successfully.',
          timer: 2000,
          showConfirmButton: false,
          background: '#111111',
          color: '#ffffff',
          customClass: {
            popup: 'border border-gray-800 rounded-xl'
          }
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving property type:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save property type.',
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const typeToDelete = propertyTypes.find((t) => t._id === id);
    
    let confirmMessage = 'Are you sure you want to delete this property type?';
    let confirmButtonText = 'Yes, delete it';
    
    if (typeToDelete?.propertyCount > 0) {
      confirmMessage = `This property type has ${typeToDelete.propertyCount} properties associated with it. Deleting it will remove the type from these properties. This action cannot be undone.`;
      confirmButtonText = 'Yes, delete anyway';
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: confirmMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel',
      background: '#111111',
      color: '#ffffff',
      customClass: {
        popup: 'border border-gray-800 rounded-xl',
        title: 'text-white text-lg font-semibold',
        htmlContainer: 'text-gray-300',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors',
        cancelButton: 'bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'
      }
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    try {
      const deleteResult = await deletePropertyType(id);
      if (deleteResult.error) throw new Error(deleteResult.error);
      
      setPropertyTypes((types) => types.filter((t) => t._id !== id));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Property type has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false,
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    } catch (error) {
      console.error('Error deleting property type:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete property type.',
        background: '#111111',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gray-800 rounded-xl'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({ ...formData, name, slug: generateSlug(name) });
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
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
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
              <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredTypes.map((type) => {
              const IconComp = type.icon && LucideIcons[type.icon] ? LucideIcons[type.icon] : null;
              return (
                <tr key={type._id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                        {IconComp ? (
                          <IconComp size={16} className="text-gray-400" />
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
                    <span className="text-sm text-gray-400 line-clamp-1">{type.description || '—'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-400">{type.propertyCount || 0} properties</span>
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
              );
            })}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Icon</label>
                <IconPickerDropdown
                  value={formData.icon}
                  onChange={(name) => setFormData({ ...formData, icon: name })}
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
                  {isLoading ? 'Saving...' : editingType ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}