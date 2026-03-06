'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus, Search, Edit, Trash2,
  FolderTree, Tag as TagIcon,
  ChevronDown, X, Check,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// ─── Icon Picker ──────────────────────────────────────────────────────────────
const EXCLUDED = new Set(['createLucideIcon', 'default', 'icons']);
const ALL_ICONS = Object.entries(LucideIcons).filter(([name, Component]) => {
  if (EXCLUDED.has(name)) return false;
  if (!/^[A-Z]/.test(name)) return false;
  if (!Component) return false;
  return Component.displayName === name || typeof Component.render === 'function' || typeof Component === 'function';
});

function SafeIcon({ Component, size = 16, className = '', style }) {
  try { return <Component size={size} className={className} style={style} />; }
  catch { return null; }
}

function IconPickerDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_ICONS.slice(0, 80);
    const q = search.toLowerCase();
    return ALL_ICONS.filter(([name]) => name.toLowerCase().includes(q)).slice(0, 80);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const SelectedIcon = value && LucideIcons[value] ? LucideIcons[value] : null;

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white hover:border-gray-700 focus:outline-none transition-colors disabled:opacity-50">
        <span className="flex items-center gap-2 flex-1 min-w-0">
          {SelectedIcon
            ? <><SafeIcon Component={SelectedIcon} size={16} className="text-gray-300 shrink-0" /><span className="text-sm text-gray-300 truncate">{value}</span></>
            : <span className="text-sm text-gray-600">Select an icon...</span>}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {value && <span onClick={e => { e.stopPropagation(); onChange(''); }} className="p-0.5 rounded hover:bg-gray-700 cursor-pointer"><X size={12} className="text-gray-500" /></span>}
          <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#111111] border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-gray-800">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input autoFocus type="text" placeholder="Search icons..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600" />
            </div>
          </div>
          <div className="p-2 grid grid-cols-8 gap-1 max-h-52 overflow-y-auto">
            {filtered.length === 0 && <div className="col-span-8 text-center py-6 text-gray-600 text-sm">No icons found</div>}
            {filtered.map(([name, IconComp]) => (
              <button key={name} type="button" title={name}
                onClick={() => { onChange(name); setOpen(false); setSearch(''); }}
                className={`flex items-center justify-center p-2 rounded-lg transition-colors ${value === name ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <SafeIcon Component={IconComp} size={16} />
              </button>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-gray-800 text-xs text-gray-600">
            {search.trim() ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : `Showing 80 of ${ALL_ICONS.length} — search to filter`}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────────────────
const COLOR_PRESETS = [
  { hex: '#6b7280', label: 'Gray' },    { hex: '#ef4444', label: 'Red' },
  { hex: '#22c55e', label: 'Green' },   { hex: '#3b82f6', label: 'Blue' },
  { hex: '#eab308', label: 'Yellow' },  { hex: '#a855f7', label: 'Purple' },
  { hex: '#f97316', label: 'Orange' },  { hex: '#6366f1', label: 'Indigo' },
  { hex: '#06b6d4', label: 'Cyan' },    { hex: '#10b981', label: 'Emerald' },
  { hex: '#ec4899', label: 'Pink' },    { hex: '#f59e0b', label: 'Amber' },
];

function resolveHex(value) {
  if (!value) return '#6b7280';
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  const preset = COLOR_PRESETS.find(p => p.label.toLowerCase() === value.toLowerCase());
  return preset ? preset.hex : '#6b7280';
}

function resolveLabel(value) {
  if (!value) return 'Gray';
  const preset = COLOR_PRESETS.find(p => p.hex === value);
  return preset ? preset.label : value;
}

function ColorPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('presets');
  const [hexInput, setHexInput] = useState(() => resolveHex(value));
  const ref = useRef(null);

  useEffect(() => { setHexInput(resolveHex(value)); }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const displayHex = resolveHex(value);
  const isCustom = !COLOR_PRESETS.find(p => p.hex === displayHex);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
        className="w-full flex items-center gap-3 px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white hover:border-gray-700 focus:outline-none transition-colors disabled:opacity-50">
        <span className="w-5 h-5 rounded-md border border-white/10 shrink-0" style={{ backgroundColor: displayHex }} />
        <span className="text-sm text-gray-300 flex-1 text-left truncate font-mono">
          {isCustom ? displayHex : resolveLabel(value)}
        </span>
        <ChevronDown size={14} className={`text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 w-64 bg-[#111111] border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-gray-800">
            {['presets', 'custom'].map(t => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${tab === t ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'presets' && (
            <div className="p-2 grid grid-cols-2 gap-1">
              {COLOR_PRESETS.map(({ hex, label }) => (
                <button key={hex} type="button" onClick={() => { onChange(hex); setOpen(false); }}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left ${displayHex === hex ? 'bg-gray-800 ring-1 ring-gray-600' : 'hover:bg-gray-800/60'}`}>
                  <span className="w-4 h-4 rounded-full shrink-0 border border-white/10" style={{ backgroundColor: hex }} />
                  <span className="text-sm text-gray-300">{label}</span>
                  {displayHex === hex && <Check size={12} className="ml-auto text-gray-400" />}
                </button>
              ))}
            </div>
          )}

          {tab === 'custom' && (
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer shrink-0">
                  <div className="w-12 h-12 rounded-xl border-2 border-gray-700 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(hexInput) ? hexInput : '#6b7280' }} />
                  <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(hexInput) ? hexInput : '#6b7280'}
                    onChange={e => { setHexInput(e.target.value); onChange(e.target.value); }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                </label>
                <div className="flex-1 space-y-1.5">
                  <p className="text-xs text-gray-500">Hex value</p>
                  <input type="text" value={hexInput} maxLength={7} placeholder="#000000"
                    onChange={e => { setHexInput(e.target.value); if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value); }}
                    className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 font-mono focus:outline-none focus:border-gray-600" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Quick picks</p>
                <div className="grid grid-cols-8 gap-1">
                  {['#f87171','#fb923c','#fbbf24','#a3e635','#34d399','#22d3ee','#818cf8','#e879f9',
                    '#f43f5e','#84cc16','#14b8a6','#6366f1','#0ea5e9','#a855f7','#ec4899','#94a3b8'].map(c => (
                    <button key={c} type="button" title={c}
                      onClick={() => { setHexInput(c); onChange(c); }}
                      className="relative w-6 h-6 rounded-md border border-white/10 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}>
                      {displayHex === c && <Check size={10} className="absolute inset-0 m-auto text-black/70" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full h-7 rounded-lg border border-white/10 flex items-center justify-center"
                style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(hexInput) ? hexInput : '#6b7280' }}>
                <span className="text-xs font-mono text-white/60 drop-shadow">{hexInput}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TagsClient({
  initialTags, tagsByCategory, usageCounts, categoryOptions,
  createTag, updateTag, deleteTag
}) {
  const [tags, setTags] = useState(initialTags || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('PURPOSE');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', slug: '', label: '', description: '',
    category: 'PURPOSE', color: '#6b7280', icon: '',
    isDefault: false, isActive: true, sortOrder: 0,
    parentId: '', metadata: '',
  });

  const filteredTags = tags.filter(tag => {
    if (!tag) return false;
    const q = searchTerm.toLowerCase();
    return tag.name?.toLowerCase().includes(q) || tag.label?.toLowerCase().includes(q) || tag.description?.toLowerCase().includes(q);
  });

  const parentOptions = tags
    .filter(t => t.category === formData.category && t._id !== editingTag?._id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

const handleOpenModal = (tag) => {
  if (tag) {
    setEditingTag(tag);
    setSelectedCategory(tag.category);
    
    // Handle metadata safely
    let metadataString = '';
    if (tag.metadata) {
      if (typeof tag.metadata === 'object' && !Array.isArray(tag.metadata)) {
        // If it's already an object, stringify it directly
        metadataString = JSON.stringify(tag.metadata, null, 2);
      } else if (Array.isArray(tag.metadata)) {
        // If it's an array (like from Object.entries), use fromEntries
        try {
          metadataString = JSON.stringify(Object.fromEntries(tag.metadata), null, 2);
        } catch (e) {
          metadataString = JSON.stringify(tag.metadata, null, 2);
        }
      } else if (typeof tag.metadata === 'string') {
        // If it's already a string, try to parse and re-stringify for formatting
        try {
          const parsed = JSON.parse(tag.metadata);
          metadataString = JSON.stringify(parsed, null, 2);
        } catch {
          metadataString = tag.metadata;
        }
      }
    }
    
    setFormData({
      name: tag.name || '', 
      slug: tag.slug || '', 
      label: tag.label || '',
      description: tag.description || '', 
      category: tag.category || 'PURPOSE',
      color: resolveHex(tag.color),
      icon: tag.icon || '', 
      isDefault: tag.isDefault || false,
      isActive: tag.isActive !== false, 
      sortOrder: tag.sortOrder || 0,
      parentId: tag.parentId || '',
      metadata: metadataString,
    });
  } else {
    setEditingTag(null);
    setSelectedCategory('PURPOSE');
    setFormData({
      name: '', slug: '', label: '', description: '',
      category: 'PURPOSE', color: '#6b7280', icon: '',
      isDefault: false, isActive: true,
      sortOrder: tags.filter(t => t.category === 'PURPOSE').length,
      parentId: '', metadata: '',
    });
  }
  setIsModalOpen(true);
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setFormData({
      name: '', slug: '', label: '', description: '',
      category: 'PURPOSE', color: '#6b7280', icon: '',
      isDefault: false, isActive: true, sortOrder: 0,
      parentId: '', metadata: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('slug', formData.slug);
      fd.append('label', formData.label);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('color', formData.color);
      fd.append('icon', formData.icon || '');
      fd.append('isDefault', formData.isDefault ? 'true' : 'false');
      fd.append('isActive', formData.isActive ? 'true' : 'false');
      fd.append('sortOrder', String(formData.sortOrder ?? 0));
      fd.append('parentId', formData.parentId || '');
      fd.append('metadata', formData.metadata || '');

      const result = editingTag
        ? await updateTag(editingTag._id, fd)
        : await createTag(fd);

      if (result.error) throw new Error(result.error);

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
      if (result.error) throw new Error(result.error);
      setTags(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({ ...formData, name, slug: generateSlug(name), label: formData.label || name });
  };

  const currentCategoryTags = filteredTags.filter(t => t.category === selectedCategory);

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Property Tags</h1>
        <p className="text-gray-400">Manage property tags like "For Sale", "For Rent", "Lease", and more</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categoryOptions.map(cat => (
          <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.value ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Search tags..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-700" />
        </div>
        <button onClick={() => handleOpenModal()} disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50">
          <Plus size={18} /><span>Add Tag</span>
        </button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCategoryTags.map(tag => {
          const usageCount = usageCounts?.[tag._id] || 0;
          const color = resolveHex(tag.color);
          const IconComp = tag.icon && LucideIcons[tag.icon] ? LucideIcons[tag.icon] : null;

          return (
            <div key={tag._id}
              className={`rounded-xl border p-4 transition-opacity ${!tag.isActive ? 'opacity-50' : ''}`}
              style={{ backgroundColor: color + '22', borderColor: color + '55' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color + '33', border: `1px solid ${color}55` }}>
                    {IconComp
                      ? <SafeIcon Component={IconComp} size={20} style={{ color }} />
                      : <span className="text-lg" style={{ color }}>◆</span>}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{tag.label}</h3>
                    <p className="text-xs text-gray-500 font-mono">{tag.name}</p>
                  </div>
                </div>
              </div>

              {tag.description && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{tag.description}</p>}

              {tag.parentName && (
                <div className="flex items-center gap-1 text-xs mb-2 text-gray-500">
                  <FolderTree size={12} />
                  <span>Parent: {tag.parentLabel || tag.parentName}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-xs flex items-center gap-1.5"
                    style={{ backgroundColor: color + '33', color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {resolveLabel(tag.color)}
                  </span>
                  {tag.isDefault && <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">Default</span>}
                  {usageCount > 0 && <span className="px-2 py-0.5 bg-green-900/50 text-green-300 rounded text-xs">{usageCount} used</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(tag)}
                    className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(tag._id)}
                    disabled={tag.isDefault || usageCount > 0}
                    title={tag.isDefault ? 'Default tags cannot be deleted' : usageCount > 0 ? 'Tag is in use' : ''}
                    className="p-1.5 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400 transition-colors disabled:opacity-30">
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
            <button onClick={() => handleOpenModal()}
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg inline-flex items-center gap-2">
              <Plus size={18} /><span>Add your first tag</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#111111] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">{editingTag ? 'Edit Tag' : 'Add New Tag'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                  <input type="text" value={formData.name} onChange={handleNameChange} required
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Slug *</label>
                  <input type="text" value={formData.slug} required
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Label *</label>
                <input type="text" value={formData.label} required
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea value={formData.description} rows={2}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                  <select value={formData.category} required
                    onChange={e => setFormData({ ...formData, category: e.target.value, parentId: '' })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600">
                    {categoryOptions.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Parent Tag</label>
                  <select value={formData.parentId}
                    onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600">
                    <option value="">None (Top Level)</option>
                    {parentOptions.map(p => <option key={p._id} value={p._id}>{p.label} ({p.name})</option>)}
                  </select>
                </div>
              </div>

              {/* Icon + Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Icon</label>
                  <IconPickerDropdown value={formData.icon} onChange={icon => setFormData({ ...formData, icon })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Color</label>
                  <ColorPicker value={formData.color} onChange={color => setFormData({ ...formData, color })} />
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Preview</label>
                {(() => {
                  const previewColor = resolveHex(formData.color);
                  const PreviewIcon = formData.icon && LucideIcons[formData.icon] ? LucideIcons[formData.icon] : null;
                  return (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                      style={{ backgroundColor: previewColor + '22', borderColor: previewColor + '55' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: previewColor + '33' }}>
                        {PreviewIcon
                          ? <SafeIcon Component={PreviewIcon} size={16} style={{ color: previewColor }} />
                          : <span style={{ color: previewColor }}>◆</span>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{formData.label || 'Tag Label'}</p>
                        <p className="text-xs font-mono text-gray-500">{formData.name || 'tag-name'}</p>
                      </div>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded flex items-center gap-1.5 font-mono"
                        style={{ backgroundColor: previewColor + '33', color: previewColor }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: previewColor }} />
                        {resolveLabel(formData.color)}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sort Order</label>
                  <input type="number" value={formData.sortOrder}
                    onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600" />
                </div>
                <div className="flex items-end gap-6 pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={formData.isDefault} className="rounded border-gray-700 bg-[#0a0a0a] accent-blue-500"
                      onChange={e => setFormData({ ...formData, isDefault: e.target.checked })} />
                    Default for Category
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} className="rounded border-gray-700 bg-[#0a0a0a] accent-blue-500"
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                    Active
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Metadata (JSON)</label>
                <textarea value={formData.metadata} rows={3} placeholder='{"key": "value"}'
                  onChange={e => setFormData({ ...formData, metadata: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-gray-600" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50">
                  {isLoading ? 'Saving...' : editingTag ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}