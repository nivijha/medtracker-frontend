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
  Loader2
} from "lucide-react";

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

const ReportCard = ({ report, onView, onDownload }) => {
  return (
    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {report.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {report.result || report.description || "No description available"}
            </p>
          </div>
        </div>
        <StatusBadge status={report.status} />
      </div>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        {report.date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(report.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        )}
        {report.doctor && (
          <span className="flex items-center gap-1">
            Dr. {report.doctor}
          </span>
        )}
        {report.category && (
          <span className="px-2 py-0.5 bg-gray-100 rounded-full">
            {report.category}
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
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    // Simulate API call - replace with your actual getReports()
    setTimeout(() => {
      const mockReports = [
        {
          _id: '1',
          name: 'Complete Blood Count (CBC)',
          result: 'All parameters within normal range. Hemoglobin: 14.2 g/dL, WBC: 7,500/µL',
          date: '2024-11-05',
          status: 'completed',
          category: 'lab',
          doctor: 'Smith'
        },
        {
          _id: '2',
          name: 'Chest X-Ray',
          result: 'No acute cardiopulmonary abnormality detected',
          date: '2024-11-01',
          status: 'reviewed',
          category: 'imaging',
          doctor: 'Johnson'
        },
        {
          _id: '3',
          name: 'Lipid Panel',
          result: 'Pending laboratory analysis',
          date: '2024-11-07',
          status: 'pending',
          category: 'lab',
          doctor: 'Williams'
        }
      ];
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({ status: 'all', category: 'all', dateRange: 'all' });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (report.result && report.result.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filters.status === 'all' || report.status === filters.status;
    const matchesCategory = filters.category === 'all' || report.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleView = (report) => {
    console.log('View report:', report);
    // Add navigation to detailed report view
  };

  const handleDownload = (report) => {
    console.log('Download report:', report);
    // Add download functionality
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
            {filteredReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onView={handleView}
                onDownload={handleDownload}
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
      </div>
    </div>
  );
}