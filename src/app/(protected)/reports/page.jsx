"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  ChevronDown,
  X,
  Loader2,
  Upload,
  Plus,
  ArrowRight,
  MoreVertical,
  Trash2,
  ChevronRight,
  Shield
} from "lucide-react";
import { getReports, uploadReport, deleteReport } from "@/lib/utils";

const ReportCard = ({ report, onView, onDownload, onDelete }) => {
  return (
    <div className="group bg-white rounded-[2.5rem] p-8 border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
            <FileText size={24} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDownload(report)}
              className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
              title="Download Record"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => onDelete(report)}
              className="p-3 bg-red-50 text-red-400 hover:text-red-600 transition-colors"
              title="Purge Record"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[8px] font-bold uppercase tracking-widest border border-slate-200">
              {report.reportType || report.type || "General"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">·</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {report.reportDate ? new Date(report.reportDate).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' }) : "Archive"}
            </span>
          </div>
          <h3 className="text-xl font-syne font-bold text-slate-900 tracking-tight leading-tight">
            {report.description || report.type || "Medical Analysis"}
          </h3>
          <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
            {report.fileDescription || "No additional clinical annotations provided for this record."}
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Plus size={12} className="text-teal-500" />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
            {report.doctorName ? `Dr. ${report.doctorName}` : "Clinical Staff"}
          </div>
        </div>
        
        <button
          onClick={() => onView(report)}
          className="group/btn flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-widest"
        >
          View Analysis
          <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -z-0 opacity-50 group-hover:bg-teal-50 transition-colors duration-500" />
    </div>
  );
};

const FilterDropdown = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2rem] border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] z-20 overflow-hidden animate-reveal-up">
      <div className="p-6 border-b border-slate-900/5 flex items-center justify-between">
        <h3 className="text-sm font-syne font-bold uppercase tracking-widest">Protocol Filters</h3>
        <button onClick={onClose} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Classification</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-xs uppercase tracking-widest"
          >
            <option value="all">All Records</option>
            <option value="lab">Lab Tests</option>
            <option value="imaging">Imaging</option>
            <option value="pathology">Pathology</option>
            <option value="cardiology">Cardiology</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Time Horizon</label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange("dateRange", e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-xs uppercase tracking-widest"
          >
            <option value="all">Full Archive</option>
            <option value="week">Recent Week</option>
            <option value="month">Recent Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Annual View</option>
          </select>
        </div>

        <button
          onClick={() => onFilterChange("reset")}
          className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
        >
          Reset Parameters
        </button>
      </div>
    </div>
  );
};

export default function EnhancedReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    dateRange: "all",
  });
  const [uploadData, setUploadData] = useState({
    name: "",
    category: "",
    doctor: "",
    date: new Date().toISOString().split("T")[0],
    file: null,
    description: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await getReports();
      // Handle both cases: direct array or object with reports property
      const reportsData = Array.isArray(res) ? res : (res?.reports || []);
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === "reset") {
      setFilters({ status: "all", category: "all", dateRange: "all" });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const filteredReports = (Array.isArray(reports) ? reports : []).filter((report) => {
    const reportDesc = report.description || "";
    const reportType = report.type || "";
    const matchesSearch =
      reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reportDesc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      filters.category === "all" || report.reportType === filters.category;

    return matchesSearch && matchesCategory;
  });

  const handleView = (report) => {
    window.open(report.fileUrl, "_blank");
  };

  const handleDownload = (report) => {
    const a = document.createElement("a");
    a.href = report.fileUrl;
    a.download = report.description || "medical-report";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setReports((prev) => prev.filter((r) => r._id !== reportToDelete._id));
      await deleteReport(reportToDelete._id);
    } catch (error) {
      console.error("Delete failed:", error);
      fetchReports();
    } finally {
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("type", uploadData.category || "report");
      formData.append("description", uploadData.description || uploadData.name);
      formData.append("doctorName", uploadData.doctor);
      formData.append("file", uploadData.file);

      await uploadReport(formData);
      setShowUploadModal(false);
      setUploadData({
        name: "",
        category: "",
        doctor: "",
        date: new Date().toISOString().split("T")[0],
        file: null,
        description: "",
      });
      fetchReports();
    } catch (error) {
      console.error("Error uploading report:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Distributed Medical Vault
          </div>
          <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tighter">
            Clinical Records.
          </h1>
          <p className="text-slate-500 text-lg font-light mt-2">
            Secure, encrypted access to your full medical dossier.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-sm font-bold uppercase tracking-widest">Ingest New Record</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-180">
            <Upload size={18} />
          </div>
        </button>
      </div>

      {/* TOOLS BAR */}
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-teal-500" />
          <input
            type="text"
            placeholder="Search records by classification or practitioner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-900/5 rounded-[2rem] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full lg:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full lg:w-auto flex items-center justify-center gap-4 px-8 py-5 rounded-[2rem] border font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-900/5 hover:border-teal-500'
              }`}
            >
              <Filter className="w-4 h-4" />
              Parameters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            <FilterDropdown
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="hidden sm:flex items-center gap-3 px-6 py-5 bg-slate-100 rounded-[2rem] border border-slate-900/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
            <Shield size={14} className="text-teal-500" />
            {filteredReports.length} Encrypted Items
          </div>
        </div>
      </div>

      {/* REPORTS GRID */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReports.map((report, index) => (
            <ReportCard
              key={report._id || `report-${index}`}
              report={report}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-900/10">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={32} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-syne font-bold text-slate-900 mb-2">Vault empty.</h3>
          <p className="text-slate-400 text-sm font-light">Your clinical reports and diagnostic history will appear in this secure space.</p>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-6 py-12">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-reveal-up overflow-hidden max-h-full relative flex flex-col">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto p-10 md:p-16 h-full">
              <div className="mb-12">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-600 mb-4">Secure Ingestion</div>
                <h2 className="text-4xl font-syne font-bold tracking-tighter">Register Record.</h2>
              </div>

              <form onSubmit={handleUpload} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Classification Name</label>
                    <input
                      required
                      value={uploadData.name}
                      onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                      placeholder="e.g. Annual Blood Work"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <select
                      required
                      value={uploadData.category}
                      onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-bold text-xs uppercase tracking-widest cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      <option value="lab">Lab Tests</option>
                      <option value="imaging">Imaging</option>
                      <option value="pathology">Pathology</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Responsible Practitioner</label>
                    <input
                      required
                      value={uploadData.doctor}
                      onChange={(e) => setFormData ? null : setUploadData({ ...uploadData, doctor: e.target.value })}
                      placeholder="Dr. Elena Rossi"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Examination Date</label>
                    <input
                      type="date"
                      required
                      value={uploadData.date}
                      onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Document Binary</label>
                  <div className="relative">
                    <input
                      type="file"
                      required
                      onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-900/10 rounded-2xl bg-slate-50 hover:bg-white hover:border-teal-500 transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-slate-300 group-hover:text-teal-500 transition-colors mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          {uploadData.file ? uploadData.file.name : "Select or Drop Clinical File"}
                        </p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-300 mt-2">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Clinical Annotations</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    rows={3}
                    placeholder="Summary of results or specialist notes..."
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <div className="pt-6">
                  <button
                    disabled={uploading}
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-[1.25rem] hover:bg-teal-600 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 group"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span>Commit to Vault</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 md:p-12 border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-reveal-up relative">
            <h3 className="text-2xl font-syne font-bold text-slate-900 mb-4 tracking-tight">Purge Record?</h3>
            <p className="text-slate-500 font-light leading-relaxed mb-10">
              You are about to permanently remove this record from the clinical vault. This action is irreversible.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => { setShowDeleteModal(false); setReportToDelete(null); }}
                className="flex-1 py-4 rounded-2xl border border-slate-900/10 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
