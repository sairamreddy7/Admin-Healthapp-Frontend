import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { userService, doctorService, patientService } from '../services/userService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    activeUsers: 0,
    activeSessions: 0,
    systemHealth: 99.9,
    failedLogins: 0,
    userGrowth: 0,
    sessionChange: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [userActivityData, setUserActivityData] = useState([]);
  const [userDistributionData, setUserDistributionData] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('🔍 Starting dashboard data fetch...');
      
      // Fetch all data in parallel
      const [usersResponse, doctorsResponse, patientsResponse] = await Promise.all([
        userService.getAll().catch(err => {
          console.error('Users API error:', err);
          return { data: [] };
        }),
        doctorService.getAll().catch(err => {
          console.error('Doctors API error:', err);
          return { data: [] };
        }),
        patientService.getAll().catch(err => {
          console.error('Patients API error:', err);
          return { data: { patients: [] } };
        })
      ]);
      
      console.log('✅ All data received');

      // Extract data
      const users = usersResponse.data || [];
      const doctors = doctorsResponse.data?.data || doctorsResponse.data || [];
      const patients = patientsResponse.data?.data?.patients || patientsResponse.data?.patients || [];

      // Calculate stats
      const adminCount = users.filter(u => u.role === 'ADMIN').length;
      const activeCount = users.filter(u => u.isActive !== false).length;
      
      // Mock calculations for growth and sessions (replace with real data when available)
      const userGrowth = users.length > 0 ? ((Math.random() * 3) + 0.5).toFixed(1) : 0;
      const activeSessions = Math.floor(users.length * 0.08); // ~8% active
      const sessionChange = ((Math.random() * 4) - 2).toFixed(1); // -2% to +2%
      const failedLogins = Math.floor(Math.random() * 10);

      setStats({
        totalUsers: users.length,
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        activeUsers: activeCount,
        activeSessions: activeSessions,
        systemHealth: 99.9,
        failedLogins: failedLogins,
        userGrowth: parseFloat(userGrowth),
        sessionChange: parseFloat(sessionChange)
      });

      // Set user distribution data with actual counts
      setUserDistributionData([
        { name: 'Patients', value: patients.length, color: '#3b82f6' },
        { name: 'Doctors', value: doctors.length, color: '#10b981' },
        { name: 'Admins', value: adminCount, color: '#f59e0b' }
      ]);

      // User activity data for the last 7 days
      setUserActivityData([
        { date: 'Mon', actions: 420, logins: 120, registrations: 12 },
        { date: 'Tue', actions: 530, logins: 150, registrations: 18 },
        { date: 'Wed', actions: 480, logins: 140, registrations: 15 },
        { date: 'Thu', actions: 610, logins: 180, registrations: 22 },
        { date: 'Fri', actions: 550, logins: 160, registrations: 19 },
        { date: 'Sat', actions: 320, logins: 90, registrations: 8 },
        { date: 'Sun', actions: 270, logins: 75, registrations: 6 }
      ]);

      // Get recent registrations
      const sortedUsers = [...users].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const recentUsers = sortedUsers.slice(0, 5).map((user) => ({
        id: user.id,
        name: user.email.split('@')[0],
        email: user.email,
        role: user.role,
        date: new Date(user.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      setRecentRegistrations(recentUsers);

      setLastUpdated(new Date());

    } catch (err) {
      console.error('❌ Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      console.log('✅ Loading complete');
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard...');
      loadDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleManualRefresh = () => {
    loadDashboardData(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-orange-100 text-orange-800';
      case 'DOCTOR': return 'bg-green-100 text-green-800';
      case 'PATIENT': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => loadDashboardData()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, Admin
          </h2>
          <p className="text-sm text-slate-500">
            Here's what's happening with your healthcare system today.
          </p>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live • Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg 
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <p className="text-base font-medium leading-normal text-slate-600">Total Users</p>
            <p className="text-2xl font-bold leading-tight tracking-tight text-slate-900">{stats.totalUsers.toLocaleString()}</p>
            <p className={`text-base font-medium leading-normal ${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth}%
            </p>
          </div>

          {/* Active Sessions */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <p className="text-base font-medium leading-normal text-slate-600">Active Sessions</p>
            <p className="text-2xl font-bold leading-tight tracking-tight text-slate-900">{stats.activeSessions}</p>
            <p className={`text-base font-medium leading-normal ${stats.sessionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.sessionChange >= 0 ? '+' : ''}{stats.sessionChange}%
            </p>
          </div>

          {/* System Health */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <p className="text-base font-medium leading-normal text-slate-600">System Health</p>
            <p className="text-2xl font-bold leading-tight tracking-tight text-slate-900">{stats.systemHealth}% Uptime</p>
            <p className="text-base font-medium leading-normal text-green-600">+0.0%</p>
          </div>

          {/* Failed Logins */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <p className="text-base font-medium leading-normal text-slate-600">Failed Logins (24h)</p>
            <p className="text-2xl font-bold leading-tight tracking-tight text-slate-900">{stats.failedLogins}</p>
            <p className="text-base font-medium leading-normal text-green-600">Low</p>
          </div>
        </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* User Activity Chart */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow lg:col-span-3">
            <p className="text-base font-medium leading-normal text-slate-900">User Activity (Last 7 Days)</p>
            <p className="truncate text-3xl font-bold leading-tight tracking-tight text-slate-900">
              {userActivityData.reduce((sum, day) => sum + day.actions, 0).toLocaleString()} Actions
            </p>
            <div className="flex gap-1">
              <p className="text-base font-normal leading-normal text-slate-500">Last 7 Days</p>
              <p className="text-base font-medium leading-normal text-green-600">+5.2%</p>
            </div>
            <div className="flex min-h-[220px] flex-1 flex-col gap-4 py-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={userActivityData}>
                  <defs>
                    <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 'bold' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '10px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actions" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#colorActions)"
                    name="Actions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Chart */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow lg:col-span-2">
            <p className="text-base font-medium leading-normal text-slate-900">User Role Distribution</p>
            <p className="truncate text-3xl font-bold leading-tight tracking-tight text-slate-900">
              {stats.totalUsers.toLocaleString()} Total Users
            </p>
            <div className="flex gap-1">
              <p className="text-base font-normal leading-normal text-slate-500">All Time</p>
              <p className="text-base font-medium leading-normal text-green-600">+{stats.userGrowth}%</p>
            </div>
            <div className="flex h-full min-h-[220px] flex-1 items-center justify-center py-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 text-center">
              {userDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <p className="text-xs font-medium text-slate-600 flex-1 text-left">
                    {item.name} ({((item.value / stats.totalUsers) * 100).toFixed(0)}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
          <p className="text-sm text-slate-500">Quickly access common administrative tasks.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={() => window.location.href = '/users'}
              className="flex items-center gap-3 rounded-lg bg-slate-100 p-4 text-left text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Add New User</p>
                <p className="text-xs text-slate-500">Onboard a new patient, doctor, or admin.</p>
              </div>
            </button>
            <button 
              onClick={() => window.location.href = '/audit-logs'}
              className="flex items-center gap-3 rounded-lg bg-slate-100 p-4 text-left text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">View Latest Audit Logs</p>
                <p className="text-xs text-slate-500">Review recent system and user activities.</p>
              </div>
            </button>
            <button 
              onClick={() => alert('Password reset feature coming soon!')}
              className="flex items-center gap-3 rounded-lg bg-slate-100 p-4 text-left text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Initiate Password Resets</p>
                <p className="text-xs text-slate-500">Help users who are locked out of their accounts.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Registrations */}
        {recentRegistrations.length > 0 && (
          <div className="mt-6 flex flex-col rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Registrations</h3>
                <p className="text-sm text-slate-500">Latest user signups</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                New
              </span>
            </div>
            <div className="space-y-3">
              {recentRegistrations.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{user.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
