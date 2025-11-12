"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Clock,
  ChevronDown,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Upload
} from "lucide-react";
import {
  getReports,
  uploadReport,
  downloadReport,
  viewReport,
  deleteReport
} from "@/lib/utils";

const StatusBadge = ({ status }) => {
  const styles = {
    completed: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    reviewed: "bg-blue-100 text-blue-700 border-blue-200"
  };
  
  const icons = {
    completed: CheckCircle,
    pending: Clock,
    reviewed: Eye
  };
  
  const Icon = icons[status] || AlertCircle;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
      <Icon className="w-3 h-3" />
      {status || 'pending'}
    </span>
  );
};

const ReportCard = ({ report, onView, onDownload, onDelete }) => {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {report.originalName}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {report.fileDescription || report.description || "No description available"}
            </p>
          </div>
        </div>
        <StatusBadge status={report.status} />
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        {report.reportDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(report.reportDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        )}
        {report.doctorName && (
          <span className="flex items-center gap-1">
            Dr. {report.doctorName}
          </span>
        )}
        {report.reportType && (
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">
            {report.reportType}
          </span>
        )}
        {report.size && (
          <span className="flex items-center gap-1">
            {(report.size / 1024 / 1024).toFixed(2)} MB
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(report)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          View Report
        </button>
        <button
          onClick={() => onDownload(report)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(report)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const FilterDropdown = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg z-10">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="lab">Lab Tests</option>
            <option value="imaging">Imaging</option>
            <option value="pathology">Pathology</option>
            <option value="cardiology">Cardiology</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select 
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        
        <button
          onClick={() => onFilterChange('reset')}
          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Reset Filters
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
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all'
  });
  const [uploadData, setUploadData] = useState({
    name: "",
    category: "",
    doctor: "",
    date: new Date().toISOString().split('T')[0],
    file: null,
    description: ""
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsData = await getReports();
      setReports(reportsData || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({ status: 'all', category: 'all', dateRange: 'all' });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filters.status === 'all' || report.status === filters.status;
    const matchesCategory = filters.category === 'all' || report.reportType === filters.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleView = async (report) => {
    try {
      const blob = await viewReport(report.reportId, report.fileId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Clean up the object URL after a short delay to allow the new window to load
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error viewing report:", error);
    }
  };

  const handleDownload = async (report) => {
    try {
      // The backend expects reportId and fileId
      // reportId is the report._id and fileId is the document._id
      const blob = await downloadReport(report.reportId, report.fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const handleDelete = async (report) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        // The backend expects reportId and fileId
        // reportId is the report._id and fileId is the document._id
        await deleteReport(report.reportId, report.fileId);
        fetchReports();
      } catch (error) {
        console.error("Error deleting report:", error);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('name', uploadData.name);
      formData.append('category', uploadData.category);
      formData.append('doctor', uploadData.doctor);
      formData.append('date', uploadData.date);
      formData.append('description', uploadData.description);
      formData.append('file', uploadData.file);
      
      await uploadReport(formData);
      setShowUploadModal(false);
      setUploadData({
        name: "",
        category: "",
        doctor: "",
        date: new Date().toISOString().split('T')[0],
        file: null,
        description: ""
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
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="font-medium">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Reports</h1>
          <p className="text-gray-600">View and manage all your medical test results</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by name or result..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <FilterDropdown
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Upload className="w-5 h-5" />
            Upload Report
          </button>
        </div>

        {/* Active Filters */}
        {(filters.status !== 'all' || filters.category !== 'all' || filters.dateRange !== 'all') && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.status !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                Status: {filters.status}
                <button onClick={() => handleFilterChange('status', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                Category: {filters.category}
                <button onClick={() => handleFilterChange('category', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.dateRange !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                Date: {filters.dateRange}
                <button onClick={() => handleFilterChange('dateRange', 'all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredReports.length} of {reports.length} reports
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report, index) => (
              <ReportCard
                key={`${report._id || report.reportId || `report-${index}`}`}
                report={report}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No reports found</h3>
            <p className="text-gray-600">
              {searchQuery || filters.status !== 'all' || filters.category !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Your medical reports will appear here'}
            </p>
          </div>
        )}

        {/* Upload Report Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Medical Report</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                  <input
                    type="text"
                    required
                    value={uploadData.name}
                    onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    value={uploadData.category}
                    onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="lab">Lab Tests</option>
                    <option value="imaging">Imaging</option>
                    <option value="pathology">Pathology</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <input
                    type="text"
                    required
                    value={uploadData.doctor}
                    onChange={(e) => setUploadData({...uploadData, doctor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
                  <input
                    type="date"
                    required
                    value={uploadData.date}
                    onChange={(e) => setUploadData({...uploadData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadData({
                        name: "",
                        category: "",
                        doctor: "",
                        date: new Date().toISOString().split('T')[0],
                        file: null,
                        description: ""
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}