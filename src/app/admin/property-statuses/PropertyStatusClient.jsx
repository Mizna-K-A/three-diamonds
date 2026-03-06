'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronDown as ChevronDownIcon,
  X,
  Check,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// ─── Icon Picker Setup ────────────────────────────────────────────────────────
const EXCLUDED = new Set(['createLucideIcon', 'default', 'icons']);

const ALL_ICONS = Object.entries(LucideIcons).filter(([name, Component]) => {
  if (EXCLUDED.has(name)) return false;
  if (!/^[A-Z]/.test(name)) return false;
  if (!Component) return false;
  return (
    Component.displayName === name ||
    typeof Component.render === 'function' ||
    typeof Component === 'function'
  );
});

function SafeIcon({ Component, size = 16, className = '' }) {
  try {
    return <Component size={size} className={className} />;
  } catch {
    return null;
  }
}

// ─── Icon Picker Dropdown ─────────────────────────────────────────────────────
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
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const SelectedIcon = value && LucideIcons[value] ? LucideIcons[value] : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="w-full flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600 hover:border-gray-700 transition-colors disabled:opacity-50"
      >
        <span className="flex items-center gap-2 flex-1 min-w-0">
          {SelectedIcon ? (
            <>
              <SafeIcon Component={SelectedIcon} size={16} className="text-gray-300 shrink-0" />
              <span className="text-sm text-gray-300 truncate">{value}</span>
            </>
          ) : (
            <span className="text-sm text-gray-600">Select an icon...</span>
          )}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="p-0.5 rounded hover:bg-gray-700 cursor-pointer"
            >
              <X size={12} className="text-gray-500" />
            </span>
          )}
          <ChevronDownIcon size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#111111] border border-gray-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
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

          <div className="p-2 grid grid-cols-8 gap-1 max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="col-span-8 text-center py-6 text-gray-600 text-sm">No icons found</div>
            )}
            {filtered.map(([name, IconComp]) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); setSearch(''); }}
                className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
                  value === name ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <SafeIcon Component={IconComp} size={16} />
              </button>
            ))}
          </div>

          <div className="px-3 py-1.5 border-t border-gray-800 text-xs text-gray-600">
            {search.trim()
              ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
              : `Showing 80 of ${ALL_ICONS.length} — search to filter`}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color Picker ─────────────────────────────────────────────────────────────
// Named presets (displayed in UI). The color field stores hex directly.
// ⚠️ Schema change required: remove enum from `color` field, use `type: String` only.
const COLOR_PRESETS = [
  { name: 'gray',    hex: '#6b7280', label: 'Gray' },
  { name: 'red',     hex: '#ef4444', label: 'Red' },
  { name: 'green',   hex: '#22c55e', label: 'Green' },
  { name: 'blue',    hex: '#3b82f6', label: 'Blue' },
  { name: 'yellow',  hex: '#eab308', label: 'Yellow' },
  { name: 'purple',  hex: '#a855f7', label: 'Purple' },
  { name: 'orange',  hex: '#f97316', label: 'Orange' },
  { name: 'indigo',  hex: '#6366f1', label: 'Indigo' },
  { name: 'cyan',    hex: '#06b6d4', label: 'Cyan' },
  { name: 'emerald', hex: '#10b981', label: 'Emerald' },
];

// Resolve display hex — value is now always a hex string
function resolveHex(value) {
  if (!value) return '#6b7280';
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  // legacy: if stored as a name, map it
  const preset = COLOR_PRESETS.find(p => p.name === value);
  return preset ? preset.hex : '#6b7280';
}

function resolveLabel(value) {
  if (!value) return 'Gray';
  const preset = COLOR_PRESETS.find(p => p.hex === value || p.name === value);
  return preset ? preset.label : value; // return hex as label for custom colors
}

// onChange(hexString) — always a hex value like '#a6db43'
function ColorPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('presets');
  const [hexInput, setHexInput] = useState(() => resolveHex(value));
  const ref = useRef(null);

  useEffect(() => {
    setHexInput(resolveHex(value));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const displayHex = resolveHex(value);
  const displayLabel = resolveLabel(value);
  const isCustom = !COLOR_PRESETS.find(p => p.hex === displayHex);

  const handlePresetClick = (hex) => {
    onChange(hex);
    setOpen(false);
  };

  const handleNativeChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    onChange(val);
  };

  const handleHexInputChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) onChange(val);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="w-full flex items-center gap-3 px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white hover:border-gray-700 focus:outline-none focus:border-gray-600 transition-colors disabled:opacity-50"
      >
        <span className="w-5 h-5 rounded-md border border-white/10 shrink-0" style={{ backgroundColor: displayHex }} />
        <span className="text-sm text-gray-300 flex-1 text-left truncate font-mono">
          {isCustom ? displayHex : displayLabel}
        </span>
        <ChevronDownIcon size={14} className={`text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 left-0 w-64 bg-[#111111] border border-gray-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {['presets', 'custom'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
                  tab === t ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'presets' && (
            <div className="p-2 grid grid-cols-2 gap-1">
              {COLOR_PRESETS.map(({ hex, label }) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handlePresetClick(hex)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left ${
                    displayHex === hex ? 'bg-gray-800 ring-1 ring-gray-600' : 'hover:bg-gray-800/60'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full shrink-0 border border-white/10" style={{ backgroundColor: hex }} />
                  <span className="text-sm text-gray-300">{label}</span>
                  {displayHex === hex && <Check size={12} className="ml-auto text-gray-400" />}
                </button>
              ))}
            </div>
          )}

          {tab === 'custom' && (
            <div className="p-3 space-y-3">
              {/* Color wheel + hex input */}
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-gray-700 hover:border-gray-500 transition-colors"
                    style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(hexInput) ? hexInput : '#6b7280' }}
                  />
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(hexInput) ? hexInput : '#6b7280'}
                    onChange={handleNativeChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </label>
                <div className="flex-1 space-y-1.5">
                  <p className="text-xs text-gray-500">Hex value</p>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    maxLength={7}
                    placeholder="#000000"
                    className="w-full px-2 py-1.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 font-mono focus:outline-none focus:border-gray-600"
                  />
                </div>
              </div>

              {/* Quick picks */}
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Quick picks</p>
                <div className="grid grid-cols-8 gap-1">
                  {[
                    '#f87171','#fb923c','#fbbf24','#a3e635',
                    '#34d399','#22d3ee','#818cf8','#e879f9',
                    '#f43f5e','#84cc16','#14b8a6','#6366f1',
                    '#0ea5e9','#a855f7','#ec4899','#94a3b8',
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      title={c}
                      onClick={() => { setHexInput(c); onChange(c); }}
                      className="relative w-6 h-6 rounded-md border border-white/10 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    >
                      {displayHex === c && <Check size={10} className="absolute inset-0 m-auto text-black/70" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview bar */}
              <div
                className="w-full h-7 rounded-lg border border-white/10 flex items-center justify-center"
                style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(hexInput) ? hexInput : '#6b7280' }}
              >
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
export default function PropertyStatusClient({
  initialStatuses,
  createPropertyStatus,
  updatePropertyStatus,
  deletePropertyStatus,
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
    color: '#6b7280',
    icon: '',
    isDefault: false,
    isActive: true,
    sortOrder: 0,
  });

  const filteredStatuses = statuses.filter((status) => {
    if (!status) return false;
    const q = searchTerm.toLowerCase();
    return (
      status.name?.toLowerCase().includes(q) ||
      status.label?.toLowerCase().includes(q) ||
      status.description?.toLowerCase().includes(q)
    );
  });

  const sortedStatuses = [...filteredStatuses].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  const handleOpenModal = (status) => {
    if (status) {
      setEditingStatus(status);
      setFormData({
        name: status.name || '',
        slug: status.slug || '',
        label: status.label || '',
        description: status.description || '',
        color: resolveHex(status.color),
        icon: status.icon || '',
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
        color: '#6b7280',
        icon: '',
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
      color: '#6b7280',
      icon: '',
      isDefault: false,
      isActive: true,
      sortOrder: 0,
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
      fd.append('color', formData.color);
      fd.append('icon', formData.icon || '');
      fd.append('isDefault', formData.isDefault ? 'true' : 'false');
      fd.append('isActive', formData.isActive ? 'true' : 'false');
      fd.append('sortOrder', String(formData.sortOrder ?? 0));

      let result;
      if (editingStatus) {
        result = await updatePropertyStatus(editingStatus._id, fd);
      } else {
        result = await createPropertyStatus(fd);
      }

      if (result.error) throw new Error(result.error);

      if (editingStatus) {
        setStatuses((s) => s.map((t) => (t._id === editingStatus._id ? result.data : t)));
      } else {
        setStatuses((s) => [...s, result.data]);
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
      if (result.error) throw new Error(result.error);
      setStatuses((s) => s.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting property status:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({ ...formData, name, slug: generateSlug(name), label: formData.label || name });
  };

  const moveStatus = (index, direction) => {
    const newStatuses = [...statuses];
    const temp = newStatuses[index];
    newStatuses[index] = newStatuses[index + direction];
    newStatuses[index + direction] = temp;
    newStatuses.forEach((status, i) => { status.sortOrder = i; });
    setStatuses(newStatuses);
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
        {sortedStatuses.map((status, index) => {
          const IconComp = status.icon && LucideIcons[status.icon] ? LucideIcons[status.icon] : null;
          const color = resolveHex(status.color);

          return (
            <div
              key={status._id}
              className={`rounded-xl border p-4 transition-opacity ${!status.isActive ? 'opacity-50' : ''}`}
              style={{
                backgroundColor: color + '22',
                borderColor: color + '55',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Icon badge */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color + '33', border: `1px solid ${color}55` }}
                  >
                    {IconComp ? (
                      <SafeIcon Component={IconComp} size={20} className="" style={{ color }} />
                    ) : (
                      <span className="text-lg" style={{ color }}>◆</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{status.label}</h3>
                    <p className="text-xs text-gray-500 font-mono">{status.name}</p>
                  </div>
                </div>

                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveStatus(index, -1)}
                    disabled={index === 0}
                    className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => moveStatus(index, 1)}
                    disabled={index === sortedStatuses.length - 1}
                    className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {status.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{status.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs flex items-center gap-1.5"
                    style={{ backgroundColor: color + '33', color }}
                  >
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                    {resolveLabel(status.color)}
                  </span>
                  {status.isDefault && (
                    <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded text-xs">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(status)}
                    className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(status._id)}
                    disabled={status.isDefault}
                    className="p-1.5 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400 transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

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
              {/* Name + Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Display Label */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
                />
              </div>

              {/* Icon + Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Icon</label>
                  <IconPickerDropdown
                    value={formData.icon}
                    onChange={(name) => setFormData({ ...formData, icon: name })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Color</label>
                  <ColorPicker
                    value={formData.color}
                    onChange={(hex) => setFormData({ ...formData, color: hex })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Preview</label>
                {(() => {
                  const previewColor = resolveHex(formData.color);
                  const previewLabel = resolveLabel(formData.color);
                  const PreviewIcon = formData.icon && LucideIcons[formData.icon] ? LucideIcons[formData.icon] : null;
                  return (
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                      style={{ backgroundColor: previewColor + '22', borderColor: previewColor + '55' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: previewColor + '33' }}
                      >
                        {PreviewIcon ? (
                          <SafeIcon Component={PreviewIcon} size={16} style={{ color: previewColor }} />
                        ) : (
                          <span style={{ color: previewColor }}>◆</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{formData.label || 'Status Label'}</p>
                        <p className="text-xs font-mono text-gray-500">{formData.name || 'status-name'}</p>
                      </div>
                      <span
                        className="ml-auto text-xs px-2 py-0.5 rounded flex items-center gap-1.5 font-mono"
                        style={{ backgroundColor: previewColor + '33', color: previewColor }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: previewColor }} />
                        {previewLabel}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Sort Order + Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
                  />
                </div>
                <div className="flex items-end gap-6 pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded border-gray-700 bg-[#0a0a0a] accent-blue-500"
                    />
                    Default
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-700 bg-[#0a0a0a] accent-blue-500"
                    />
                    Active
                  </label>
                </div>
              </div>

              {/* Actions */}
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
                  {isLoading ? 'Saving...' : editingStatus ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}