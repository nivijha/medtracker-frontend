"use client";

import React, { useState, useEffect } from "react";
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { 
  exportUserData, 
  getExportHistory 
} from "@/lib/utils";

const ExportHistoryItem = ({ item }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      case 'failed': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const Icon = getStatusIcon(item.status);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 capitalize">
              {item.format} Export
            </h3>
            <p className="text-sm text-gray-600">
              {item.dataTypes?.join(', ') || 'All data'}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {item.fileSize || 'Unknown size'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
            <Icon className="w-4 h-4 inline mr-1" />
            {item.status}
          </span>
          {item.status === 'completed' && item.downloadUrl && (
            <button
              onClick={() => window.open(item.downloadUrl, '_blank')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DataExportPage() {
  const [exportHistory, setExportHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportData, setExportData] = useState({
    format: 'json',
    dataTypes: ['appointments', 'medications', 'reports', 'healthMetrics'],
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchExportHistory();
  }, []);

  const fetchExportHistory = async () => {
    try {
      setLoading(true);
      const history = await getExportHistory();
      setExportHistory(history || []);
    } catch (error) {
      console.error("Error fetching export history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (e) => {
    e.preventDefault();
    try {
      setExporting(true);
      const result = await exportUserData(exportData);
      
      // Create download link
      if (result.downloadUrl) {
        const a = document.createElement('a');
        a.href = result.downloadUrl;
        a.download = `medtracker-export.${exportData.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      // Refresh export history
      fetchExportHistory();
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleDataTypeChange = (dataType) => {
    setExportData(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataType)
        ? prev.dataTypes.filter(type => type !== dataType)
        : [...prev.dataTypes, dataType]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Loading export history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Export</h1>
          <p className="text-gray-600">Export your medical data in various formats</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Export</h2>
            <form onSubmit={handleExport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {['json', 'csv', 'pdf'].map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => setExportData({...exportData, format})}
                      className={`p-3 rounded-lg border-2 transition-all capitalize ${
                        exportData.format === format
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {exportData.format === format && (
                        <CheckCircle className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      )}
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Types</label>
                <div className="space-y-2">
                  {[
                    { id: 'appointments', label: 'Appointments' },
                    { id: 'medications', label: 'Medications' },
                    { id: 'reports', label: 'Medical Reports' },
                    { id: 'healthMetrics', label: 'Health Metrics' },
                    { id: 'profile', label: 'Profile Information' },
                    { id: 'prescriptions', label: 'Prescriptions' }
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exportData.dataTypes.includes(type.id)}
                        onChange={() => handleDataTypeChange(type.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={exportData.dateRange}
                  onChange={(e) => setExportData({...exportData, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="lastyear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {exportData.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={exportData.startDate}
                      onChange={(e) => setExportData({...exportData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={exportData.endDate}
                      onChange={(e) => setExportData({...exportData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={exporting || exportData.dataTypes.length === 0}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 inline mr-2" />
                    Export Data
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Export History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export History</h2>
            {exportHistory.length > 0 ? (
              <div className="space-y-4">
                {exportHistory.map((item) => (
                  <ExportHistoryItem key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No export history</h3>
                <p className="text-gray-600">Your previous exports will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Privacy & Security</h3>
              <p className="text-sm text-blue-800">
                Your medical data is encrypted and protected. Exports are processed securely and 
                download links are temporary for your privacy. You can request deletion of your data 
                at any time by contacting support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}