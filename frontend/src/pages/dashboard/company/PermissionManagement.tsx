import React, { useState, useEffect } from 'react';
import { Users, Shield, Plus, Trash2, UserPlus, X, Search, AlertCircle, Loader2, Edit2, MoreVertical } from 'lucide-react';
import permissionService, { Permission, EmployeePermission } from '../../../services/permissionService';
import employeeService from '../../../services/employeeService';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  phone: string;
  status: string;
  permissions?: EmployeePermission[];
}

const PermissionManagement = () => {
  const [activeTab, setActiveTab] = useState('permissions');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showPermissionMenu, setShowPermissionMenu] = useState<string | null>(null);

  const PERMISSION_OPTIONS = [
  "order_management",
  "stock_management",
  "requisition_management",
  "menu_management",
];

const availablePermissions = PERMISSION_OPTIONS.filter(
  (option) => !permissions.some((p) => p.name === option)
);

  
  // Form states
  const [permissionName, setPermissionName] = useState('');
  const [permissionDesc, setPermissionDesc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch permissions
  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await permissionService.getAll();
      setPermissions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch employees with their permissions
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAllEmployees();
      
      // Fetch permissions for each employee
      const employeesWithPermissions = await Promise.all(
        data.map(async (emp: Employee) => {
          try {
            const perms = await permissionService.getEmployeePermissions(emp.id);
            return { ...emp, permissions: perms };
          } catch {
            return { ...emp, permissions: [] };
          }
        })
      );
      
      setEmployees(employeesWithPermissions);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };
  
  // Create permission
  const createPermission = async () => {
    if (!permissionName.trim()) {
      setError('Permission name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const newPermission = await permissionService.createPermission({
        name: permissionName.trim(),
        description: permissionDesc.trim() || undefined
      });
      
      setPermissions([newPermission, ...permissions]);
      setSuccess('Permission created successfully');
      setShowCreateModal(false);
      setPermissionName('');
      setPermissionDesc('');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create permission');
    } finally {
      setLoading(false);
    }
  };
  
  // Update permission
  const updatePermission = async () => {
    if (!selectedPermission || !permissionName.trim()) {
      setError('Permission name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedPermission = await permissionService.updatePermission(selectedPermission.id, {
        name: permissionName.trim(),
        description: permissionDesc.trim() || undefined
      });
      
      setPermissions(permissions.map(p => 
        p.id === updatedPermission.id ? updatedPermission : p
      ));
      
      setSuccess('Permission updated successfully');
      setShowEditModal(false);
      setSelectedPermission(null);
      setPermissionName('');
      setPermissionDesc('');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update permission');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete permission
  const deletePermission = async () => {
    if (!selectedPermission) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await permissionService.deletePermission(selectedPermission.id);
      
      setPermissions(permissions.filter(p => p.id !== selectedPermission.id));
      setSuccess('Permission deleted successfully');
      setShowDeleteModal(false);
      setSelectedPermission(null);
      
      // Refresh employees to update their permissions
      await fetchEmployees();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete permission');
    } finally {
      setLoading(false);
    }
  };
  
  // Assign permission to employee
  const assignPermission = async (employeeId: string, permissionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await permissionService.assignPermission(employeeId, permissionId);
      setSuccess('Permission assigned successfully');
      setShowAssignModal(false);
      setSelectedPermission(null);
      setSelectedEmployee(null);
      
      await fetchEmployees();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to assign permission');
    } finally {
      setLoading(false);
    }
  };
  
  // Remove permission from employee
  const removePermission = async (employeeId: string, permissionId: string) => {
    if (!confirm('Are you sure you want to remove this permission?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await permissionService.removePermission(employeeId, permissionId);
      setSuccess('Permission removed successfully');
      
      setEmployees(employees.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            permissions: emp.permissions?.filter(p => p.permissionId !== permissionId)
          };
        }
        return emp;
      }));
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove permission');
    } finally {
      setLoading(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setPermissionName(permission.name);
    setPermissionDesc(permission.description || '');
    setShowEditModal(true);
    setShowPermissionMenu(null);
  };
  
  // Open delete modal
  const openDeleteModal = (permission: Permission) => {
    setSelectedPermission(permission);
    setShowDeleteModal(true);
    setShowPermissionMenu(null);
  };
  
  useEffect(() => {
    fetchPermissions();
    fetchEmployees();
  }, []);
  
  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-600" />
            Permission Management
          </h1>
          <p className="text-gray-600 mt-2">Manage permissions and assign them to employees</p>
        </div>
        
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-5 h-5 text-red-600 hover:text-red-800" />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="w-5 h-5 text-green-600 hover:text-green-800" />
            </button>
          </div>
        )}
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('permissions')}
                className={`py-4 px-2 border-b-2 font-medium transition ${
                  activeTab === 'permissions'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Permissions ({permissions.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-4 px-2 border-b-2 font-medium transition ${
                  activeTab === 'employees'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Employees ({employees.length})
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">All Permissions</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                Create Permission
              </button>
            </div>
            
            {loading && permissions.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : permissions.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No permissions created yet</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-primary-600 hover:text-primary-700"
                >
                  Create your first permission
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map(permission => (
                  <div key={permission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary-600" />
                        <h3 className="font-semibold text-gray-900">{permission.name}</h3>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowPermissionMenu(showPermissionMenu === permission.id ? null : permission.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {showPermissionMenu === permission.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => openEditModal(permission)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit Permission
                            </button>
                            <button
                              onClick={() => openDeleteModal(permission)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Permission
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {permission.description && (
                      <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPermission(permission);
                        setSelectedEmployee(null);
                        setShowAssignModal(true);
                      }}
                      className="w-full bg-primary-50 text-primary-600 px-3 py-2 rounded hover:bg-primary-100 flex items-center justify-center gap-2 text-sm transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      Assign to Employee
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Permissions</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {loading && employees.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No employees found matching your search' : 'No employees available'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEmployees.map(employee => (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-gray-500">{employee.position}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            employee.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {employee.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setSelectedPermission(null);
                          setShowAssignModal(true);
                        }}
                        className="bg-primary-50 text-primary-600 px-3 py-2 rounded hover:bg-primary-100 flex items-center gap-2 text-sm transition"
                      >
                        <Plus className="w-4 h-4" />
                        Add Permission
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {employee.permissions && employee.permissions.length > 0 ? (
                        employee.permissions.map(ep => (
                          <div
                            key={ep.id}
                            className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            <Shield className="w-3 h-3" />
                            <span>{ep.permission?.name}</span>
                            <button
                              onClick={() => removePermission(employee.id, ep.permissionId)}
                              className="hover:text-red-600 transition"
                              disabled={loading}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">No permissions assigned</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create Permission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Permission</h3>
              <button onClick={() => setShowCreateModal(false)} disabled={loading}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Permission Name *
  </label>

  <select
    value={permissionName}
    onChange={(e) => setPermissionName(e.target.value)}
    disabled={loading}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
               focus:ring-2 focus:ring-primary-500 focus:outline-none"
  >
    <option value="" disabled>
      -- Select Permission --
    </option>

    {availablePermissions.map((permission) => (
      <option key={permission} value={permission}>
        {permission.replace("_", " ").toUpperCase()}
      </option>
    ))}
  </select>
</div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={permissionDesc}
                  onChange={(e) => setPermissionDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe what this permission allows"
                  disabled={loading}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={createPermission}
                  disabled={loading || !permissionName.trim()}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Permission'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Permission Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Permission</h3>
              <button onClick={() => setShowEditModal(false)} disabled={loading}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permission Name *
                </label>
                <input
                  type="text"
                  value={permissionName}
                  onChange={(e) => setPermissionName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., VIEW_REPORTS, MANAGE_INVENTORY"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={permissionDesc}
                  onChange={(e) => setPermissionDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe what this permission allows"
                  disabled={loading}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={updatePermission}
                  disabled={loading || !permissionName.trim()}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Permission'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPermission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-red-600">Delete Permission</h3>
              <button onClick={() => setShowDeleteModal(false)} disabled={loading}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">Are you sure you want to delete this permission?</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-semibold text-red-900">{selectedPermission.name}</p>
                {selectedPermission.description && (
                  <p className="text-sm text-red-700 mt-1">{selectedPermission.description}</p>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                This will remove the permission from all employees who currently have it.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={deletePermission}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Permission
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Assign Permission Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Assign Permission</h3>
              <button onClick={() => setShowAssignModal(false)} disabled={loading}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            {selectedPermission && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Permission:</p>
                <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded font-medium">
                  {selectedPermission.name}
                </div>
                {selectedPermission.description && (
                  <p className="text-xs text-gray-500 mt-1">{selectedPermission.description}</p>
                )}
              </div>
            )}
            
            {selectedEmployee && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Employee:</p>
                <div className="bg-gray-50 px-3 py-2 rounded">
                  <p className="font-medium">{selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                  <p className="text-sm text-gray-600">{selectedEmployee.email}</p>
                  <p className="text-xs text-gray-500">{selectedEmployee.position}</p>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedPermission ? 'Select Employee' : 'Select Permission'}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) return;
                  
                  if (selectedPermission) {
                    const emp = employees.find(e => e.id === id);
                    if (emp) assignPermission(emp.id, selectedPermission.id);
                  } else if (selectedEmployee) {
                    const perm = permissions.find(p => p.id === id);
                    if (perm) assignPermission(selectedEmployee.id, perm.id);
                  }
                }}
                disabled={loading}
              >
                <option value="">-- Select {selectedPermission ? 'Employee' : 'Permission'} --</option>
                {selectedEmployee && permissions.map(perm => {
                  const hasPermission = selectedEmployee.permissions?.some(p => p.permissionId === perm.id);
                  return (
                    <option key={perm.id} value={perm.id} disabled={hasPermission}>
                      {perm.name} {hasPermission ? '✓ Already assigned' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <button
              onClick={() => {
                setShowAssignModal(false);
                setSelectedPermission(null);
                setSelectedEmployee(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManagement;
               