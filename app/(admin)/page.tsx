"use client";
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FaUsers,
  FaChartBar,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaSearch,
  FaFilter,
  FaEdit,
  FaEye,
  FaCalendarAlt,
  FaChartLine,
  FaUserCheck,
  FaClock,
  FaCheckCircle,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa';
import AuthWrapper from './components/AuthWrapper';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  courseInterest: string;
  neetScore: string;
  status: 'new' | 'contacted' | 'in-progress' | 'closed';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalEnquiries: number;
  todayEnquiries: number;
  weekEnquiries: number;
  monthEnquiries: number;
  statusStats: Record<string, number>;
  courseStats: Record<string, number>;
  recentEnquiries: Enquiry[];
}

interface EnquiriesResponse {
  enquiries: Enquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const AdminPanel: React.FC = () => {
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [enquiriesPerPage] = useState(10);

  // Debounced search to prevent excessive API calls
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    setSearchTimeout(timeout);
  }, [search]);

  // Fetch enquiries with React Query
  const { data: enquiriesData, isLoading: enquiriesLoading, error: enquiriesError, refetch: refetchEnquiries } = useQuery<EnquiriesResponse>({
    queryKey: ['enquiries', currentPage, statusFilter, debouncedSearch],
    queryFn: async (): Promise<EnquiriesResponse> => {
      const response = await fetch(`/api/admin/enquiries?page=${currentPage}&limit=${enquiriesPerPage}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}${debouncedSearch ? `&search=${debouncedSearch}` : ''}`);
      const data = await response.json();
      return data;
    },
    placeholderData: (previousData) => previousData,
    initialData: { enquiries: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } }
  });

  // Fetch stats with React Query
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      return data;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        refetchEnquiries();
        refetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateEnquiryNotes = async () => {
    try {
      const response = await fetch(`/api/admin/enquiries/${selectedEnquiry?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        refetchEnquiries();
        refetchStats();
      }
    } catch (error) {
      console.error('Error updating enquiry notes:', error);
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        refetchEnquiries();
        refetchStats();
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <FaUsers className="text-blue-600" />;
      case 'contacted':
        return <FaPhone className="text-yellow-600" />;
      case 'in-progress':
        return <FaClock className="text-purple-600" />;
      case 'closed':
        return <FaCheckCircle className="text-green-600" />;
      default:
        return <FaUsers className="text-gray-600" />;
    }
  };

  if (enquiriesLoading && !enquiriesData?.enquiries) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Enquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.totalEnquiries || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaCalendarAlt className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.todayEnquiries || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaChartLine className="text-purple-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.weekEnquiries || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaChartBar className="text-orange-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{statsData.monthEnquiries || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Enquiries</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiriesData?.enquiries?.map((enquiry: Enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                      {enquiry.neetScore && (
                        <div className="text-xs text-gray-500">NEET: {enquiry.neetScore}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-2 text-xs" />
                          {enquiry.email}
                        </div>
                      </div>
                      {enquiry.mobile && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaPhone className="text-gray-400 mr-2 text-xs" />
                          {enquiry.mobile}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaGraduationCap className="text-gray-400 mr-2 text-xs" />
                        <span className="text-sm text-gray-900">{enquiry.courseInterest}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                        {getStatusIcon(enquiry.status)}
                        <span className="ml-1">{enquiry.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enquiry);
                            setNotes(enquiry.notes);
                            setShowDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                        <select
                          value={enquiry.status}
                          onChange={(e) => updateEnquiryStatus(enquiry._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in-progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => {
                            setDeleteConfirm(enquiry.name);
                            setDeletingId(enquiry._id);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors ml-2"
                          title="Delete enquiry"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {enquiriesData?.enquiries && enquiriesData.enquiries.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * enquiriesPerPage) + 1} to {Math.min(currentPage * enquiriesPerPage, enquiriesData.enquiries.length)} of {enquiriesData.enquiries.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {currentPage} of {Math.ceil(enquiriesData.enquiries.length / enquiriesPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(enquiriesData.enquiries.length / enquiriesPerPage)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Details Modal */}
      {showDetails && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.mobile || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course Interest</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.courseInterest}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NEET Score</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.neetScore || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEnquiry.status)}`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  {editingNotes ? (
                    <div className="space-y-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Add notes about this enquiry..."
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingNotes(false);
                            setNotes(selectedEnquiry.notes);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={updateEnquiryNotes}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg min-h-20">
                        {selectedEnquiry.notes || 'No notes added yet.'}
                      </p>
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <FaEdit className="inline mr-1" />
                        Edit Notes
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                    <div>
                      <label className="block font-medium mb-2">Created</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Last Updated</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">{new Date(selectedEnquiry.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      onClick={async () => {
                        if (selectedEnquiry) {
                          setDeleteConfirm(selectedEnquiry.name);
                          setDeletingId(selectedEnquiry._id);
                        }
                      }}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      disabled={!selectedEnquiry}
                    >
                      <FaTrash className="mr-2" />
                      Delete Enquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">Confirm Delete</h3>
              <p className="text-[#94A3B8] mb-4">Are you sure you want to delete this enquiry?</p>
              <p className="text-sm text-[#64748B] mb-6">
                <strong>{deleteConfirm}</strong> - This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setDeleteConfirm(null);
                    setDeletingId(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (deletingId) {
                      await deleteEnquiry(deletingId);
                      setDeleteConfirm(null);
                      setDeletingId(null);
                    }
                  }}
                  disabled={!deletingId}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === deleteConfirm ? (
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthWrapper>
  );
};

export default AdminPanel;
