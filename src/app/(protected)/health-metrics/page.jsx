"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Plus, 
  Calendar, 
  Search,
  Filter,
  Loader2,
  Droplets,
  Thermometer,
  Weight,
  Target
} from "lucide-react";
import { 
  getHealthMetrics, 
  createHealthMetric, 
  updateHealthMetric, 
  deleteHealthMetric,
  getHealthMetricsSummary,
  getHealthTrends,
  getBMIHistory
} from "@/lib/utils";

const MetricCard = ({ title, value, unit, icon: Icon, trend, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">
          {value}
          <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );
};

const MetricItem = ({ metric, onEdit, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'blood_pressure': return Heart;
      case 'weight': return Weight;
      case 'temperature': return Thermometer;
      case 'blood_sugar': return Droplets;
      default: return Activity;
    }
  };

  const Icon = getIcon(metric.type);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 capitalize">
              {metric.type.replace('_', ' ')}
            </h3>
            <p className="text-sm text-gray-600">
              {metric.value} {metric.unit}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(metric.date).toLocaleDateString()}
              </div>
              {metric.notes && (
                <span className="text-gray-400">• {metric.notes}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => onEdit(metric)}
          >
            Edit
          </button>
          <button 
            className="text-sm text-red-600 hover:text-red-700 font-medium"
            onClick={() => onDelete(metric._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HealthMetricsPage() {
  const [metrics, setMetrics] = useState([]);
  const [summary, setSummary] = useState({});
  const [trends, setTrends] = useState({});
  const [bmiHistory, setBmiHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [formData, setFormData] = useState({
    type: "blood_pressure",
    value: "",
    unit: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const [metricsData, summaryData, trendsData, bmiData] = await Promise.all([
        getHealthMetrics(),
        getHealthMetricsSummary(),
        getHealthTrends('all', '30days'),
        getBMIHistory()
      ]);
      
      setMetrics(metricsData || []);
      setSummary(summaryData || {});
      setTrends(trendsData || {});
      setBmiHistory(bmiData || []);
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetric = async (e) => {
    e.preventDefault();
    try {
      if (editingMetric) {
        await updateHealthMetric(editingMetric._id, formData);
        setEditingMetric(null);
      } else {
        await createHealthMetric(formData);
      }
      
      setShowAddModal(false);
      setFormData({
        type: "blood_pressure",
        value: "",
        unit: "",
        date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      fetchHealthData();
    } catch (error) {
      console.error("Error saving health metric:", error);
    }
  };

  const handleEditMetric = (metric) => {
    setEditingMetric(metric);
    setFormData({
      type: metric.type,
      value: metric.value,
      unit: metric.unit,
      date: new Date(metric.date).toISOString().split('T')[0],
      notes: metric.notes || ""
    });
    setShowAddModal(true);
  };

  const handleDeleteMetric = async (metricId) => {
    if (window.confirm("Are you sure you want to delete this health metric?")) {
      try {
        await deleteHealthMetric(metricId);
        fetchHealthData();
      } catch (error) {
        console.error("Error deleting health metric:", error);
      }
    }
  };

  const getUnitForType = (type) => {
    switch (type) {
      case 'blood_pressure': return 'mmHg';
      case 'weight': return 'kg';
      case 'height': return 'cm';
      case 'temperature': return '°F';
      case 'blood_sugar': return 'mg/dL';
      case 'heart_rate': return 'bpm';
      default: return '';
    }
  };

  const filteredMetrics = metrics.filter(metric => 
    metric.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    metric.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Loading health metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Metrics</h1>
            <p className="text-gray-600 mt-1">Track your vital signs and health measurements</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Metric
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Blood Pressure"
            value={summary.latestBloodPressure || "120/80"}
            unit="mmHg"
            icon={Heart}
            color="red"
            trend={summary.bloodPressureTrend}
          />
          <MetricCard
            title="Weight"
            value={summary.latestWeight || "70"}
            unit="kg"
            icon={Weight}
            color="blue"
            trend={summary.weightTrend}
          />
          <MetricCard
            title="Heart Rate"
            value={summary.latestHeartRate || "72"}
            unit="bpm"
            icon={Activity}
            color="red"
            trend={summary.heartRateTrend}
          />
          <MetricCard
            title="BMI"
            value={summary.latestBMI || "22.5"}
            unit=""
            icon={Target}
            color="green"
            trend={summary.bmiTrend}
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search health metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>

        {/* Metrics List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Measurements</h2>
            <p className="text-sm text-gray-600 mt-1">Your latest health metrics and measurements</p>
          </div>
          <div className="p-4">
            {filteredMetrics.length > 0 ? (
              <div className="space-y-4">
                {filteredMetrics.map((metric) => (
                  <MetricItem
                    key={metric._id}
                    metric={metric}
                    onEdit={handleEditMetric}
                    onDelete={handleDeleteMetric}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No health metrics found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Try adjusting your search' : 'Start tracking your health metrics by adding your first measurement'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Metric Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingMetric ? 'Edit Health Metric' : 'Add Health Metric'}
              </h2>
              <form onSubmit={handleAddMetric} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metric Type</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value, unit: getUnitForType(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blood_pressure">Blood Pressure</option>
                    <option value="weight">Weight</option>
                    <option value="height">Height</option>
                    <option value="temperature">Temperature</option>
                    <option value="blood_sugar">Blood Sugar</option>
                    <option value="heart_rate">Heart Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="text"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    placeholder={formData.type === 'blood_pressure' ? '120/80' : 'Enter value'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder={getUnitForType(formData.type)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    placeholder="Add any notes about this measurement..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingMetric(null);
                      setFormData({
                        type: "blood_pressure",
                        value: "",
                        unit: "",
                        date: new Date().toISOString().split('T')[0],
                        notes: ""
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingMetric ? 'Update Metric' : 'Add Metric'}
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