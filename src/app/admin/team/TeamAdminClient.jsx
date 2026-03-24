"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Upload,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  createTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  updateTeamMember,
} from "./actions";

export default function TeamAdminClient({ initialMembers }) {
  const [members, setMembers] = useState(
    (initialMembers || []).map((m) => ({ ...m, _dirty: false }))
  );
  const [saving, setSaving] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRefs = useRef({});

  const showSwalToast = (type, msg) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toastEl) => {
        toastEl.addEventListener("mouseenter", Swal.stopTimer);
        toastEl.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: type,
      title: msg,
      background: "#111111",
      color: "#ffffff",
      iconColor: type === "success" ? "#4ade80" : "#ef4444",
    });
  };

  const updateField = (id, field, value) => {
    setMembers((prev) =>
      prev.map((m) => (m._id === id ? { ...m, [field]: value, _dirty: true } : m))
    );
  };

  const saveAllMembers = async () => {
    const dirtyMembers = members.filter((m) => m._dirty);
    if (dirtyMembers.length === 0) return;

    setSaving("all");
    try {
      await Promise.all(
        dirtyMembers.map((m) =>
          updateTeamMember(m._id, {
            name: m.name,
            role: m.role,
            experience: m.experience,
            description: m.description,
            specialties: m.specialties,
            image: m.image,
            alt: m.name,
            order: m.order,
            active: m.active,
          })
        )
      );
      setMembers((prev) => prev.map((m) => ({ ...m, _dirty: false })));
      showSwalToast("success", "All members saved!");
    } catch (e) {
      console.error(e);
      showSwalToast("error", "Failed to save some members");
    } finally {
      setSaving(null);
    }
  };

  const deleteMember = async (id) => {
    const result = await Swal.fire({
      title: "Delete Team Member?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#111111",
      color: "#ffffff",
      iconColor: "#ef4444",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setDeleting(id);
    try {
      await deleteTeamMember(id);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      showSwalToast("success", "Member deleted");
    } catch (e) {
      console.error(e);
      showSwalToast("error", "Failed to delete member");
    } finally {
      setDeleting(null);
    }
  };

  const addMember = async () => {
    const result = await Swal.fire({
      title: "Add New Member",
      html: `
                <input type="text" id="name" class="swal2-input" placeholder="Full Name" value="New Member">
                <input type="text" id="role" class="swal2-input" placeholder="Role" value="Team Member">
            `,
      confirmButtonText: "Add",
      confirmButtonColor: "#000000",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      background: "#111111",
      color: "#ffffff",
      preConfirm: () => {
        const name = document.getElementById("name")?.value;
        const role = document.getElementById("role")?.value;
        if (!name) {
          Swal.showValidationMessage("Name is required");
          return false;
        }
        return { name, role };
      },
    });

    if (!result.isConfirmed) return;

    const maxOrder =
      members.length > 0 ? Math.max(...members.map((m) => m.order ?? 0)) + 1 : 0;

    try {
      const newMember = await createTeamMember({
        name: result.value.name,
        role: result.value.role,
        experience: "1 Year",
        description: "Add description here",
        specialties: [],
        image: "/founder.png",
        alt: result.value.name,
        order: maxOrder,
        active: true,
      });
      setMembers((prev) => [...prev, { ...newMember, _dirty: false }]);
      showSwalToast("success", "New member added");
    } catch (e) {
      console.error(e);
      showSwalToast("error", "Failed to add member");
    }
  };

  const uploadImage = async (memberId, file) => {
    setUploading(memberId);

    Swal.fire({
      title: "Uploading...",
      text: "Please wait while we upload your image",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: "#111111",
      color: "#ffffff",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      updateField(memberId, "image", url);

      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Photo uploaded successfully",
        timer: 1500,
        showConfirmButton: false,
        background: "#111111",
        color: "#ffffff",
        iconColor: "#4ade80",
      });
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Photo upload failed",
        background: "#111111",
        color: "#ffffff",
        iconColor: "#ef4444",
      });
    } finally {
      setUploading(null);
    }
  };

  const moveMember = async (id, dir) => {
    const idx = members.findIndex((m) => m._id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= members.length) return;

    const updated = [...members];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    const reordered = updated.map((m, i) => ({ ...m, order: i, _dirty: true }));
    setMembers(reordered);

    try {
      await reorderTeamMembers(reordered.map((m) => ({ id: m._id, order: m.order })));
      setMembers((prev) => prev.map((m) => ({ ...m, _dirty: false })));
      showSwalToast("success", "Order updated");
    } catch (e) {
      console.error(e);
      showSwalToast("error", "Failed to update order");
    }
  };

  const handleSpecialtiesChange = (id, specialtiesStr) => {
    const specialties = specialtiesStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    updateField(id, "specialties", specialties);
  };

  const hasChanges = members.some(m => m._dirty);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] p-6 md:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style jsx global>{`
        .swal2-popup {
          font-family: "DM Sans", sans-serif;
          border: 1px solid #2a2a2a;
        }
        .swal2-input {
          background: #1f1f1f;
          border: 1px solid #333;
          color: white;
        }
        .swal2-input:focus {
          border-color: #666;
          box-shadow: none;
        }
        .swal2-validation-message {
          background: #2a2a2a;
          color: #ef4444;
        }
      `}</style>

      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${toast.type === "success"
              ? "bg-gray-900 border-green-700 text-green-400"
              : "bg-gray-900 border-red-700 text-red-400"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Team Members
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage the leadership and team section
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveAllMembers}
            disabled={saving === "all" || !hasChanges}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg ${hasChanges
                ? "bg-green-600 text-white hover:bg-green-500 hover:scale-105 active:scale-95"
                : "bg-gray-900 text-gray-500 border border-gray-800 cursor-not-allowed opacity-50"
              }`}
          >
            {saving === "all" ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving === "all" ? "Saving..." : "Save All Changes"}
          </button>
          <button
            onClick={addMember}
            className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-150 shadow-lg"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>
      </div>

      {members.length === 0 && (
        <div className="text-center py-24 text-gray-600">
          <p className="text-lg">No team members yet.</p>
        </div>
      )}

      {members.length > 0 && (
        <div className="space-y-6">
          {members.map((member, idx) => (
            <div
              key={member._id}
              className={`bg-[#111111] rounded-2xl border transition-all duration-200 overflow-hidden ${member._dirty ? "border-green-900/50 bg-[#121412]" : "border-gray-800"
                }`}
            >
              <div className="flex flex-col lg:flex-row gap-6 p-6">
                <div className="flex lg:flex-col items-center gap-4 shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-gray-600 text-xs font-semibold">
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => moveMember(member._id, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveMember(member._id, 1)}
                      disabled={idx === members.length - 1}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div
                    className="relative group cursor-pointer w-32 h-32 rounded-full overflow-hidden border border-gray-800 bg-gray-900"
                    onClick={() => fileInputRefs.current[member._id]?.click()}
                  >
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploading === member._id ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-white animate-spin rounded-full" />
                      ) : (
                        <Upload size={20} className="text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => (fileInputRefs.current[member._id] = el)}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(member._id, file);
                      e.target.value = "";
                    }}
                  />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Full Name
                    </label>
                    <input
                      value={member.name}
                      onChange={(e) =>
                        updateField(member._id, "name", e.target.value)
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Role / Title
                    </label>
                    <input
                      value={member.role}
                      onChange={(e) =>
                        updateField(member._id, "role", e.target.value)
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Experience
                    </label>
                    <input
                      value={member.experience}
                      onChange={(e) =>
                        updateField(member._id, "experience", e.target.value)
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Specialties (comma separated)
                    </label>
                    <input
                      value={(member.specialties || []).join(", ")}
                      onChange={(e) =>
                        handleSpecialtiesChange(member._id, e.target.value)
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 block">
                      Biography / Description
                    </label>
                    <textarea
                      value={member.description}
                      onChange={(e) =>
                        updateField(member._id, "description", e.target.value)
                      }
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:border-gray-600 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex lg:flex-col justify-end gap-2 shrink-0">
                  <button
                    onClick={() =>
                      updateField(member._id, "active", !member.active)
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${member.active
                        ? "bg-green-500/10 text-green-400 border border-green-700/40"
                        : "bg-gray-800 text-gray-500 border border-gray-700"
                      }`}
                  >
                    {member.active ? <Eye size={12} /> : <EyeOff size={12} />}
                    {member.active ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => deleteMember(member._id)}
                    disabled={deleting === member._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-gray-800 hover:bg-red-500/10 hover:border-red-700/40 transition-all"
                  >
                    {deleting === member._id ? (
                      <div className="w-3 h-3 border border-red-400 border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
              {member._dirty && (
                <div className="px-6 py-2 bg-green-500/5 border-t border-green-900/30 text-[10px] text-green-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Unsaved changes — click &quot;Save All Changes&quot; to apply
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

