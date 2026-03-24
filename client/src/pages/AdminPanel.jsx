import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const mockData = {
          totalUsers: 1543,
          activeUsers: 892,
          averageScore: 680,
          newUsersToday: 42,
          systemHealth: 98.5,
          recentActivities: [
            { user: 'John Doe', action: 'Logged in', time: 'Just now' },
            { user: 'Jane Smith', action: 'Updated Profile', time: '5 min ago' },
            { user: 'Bob Johnson', action: 'Generated Report', time: '12 min ago' },
          ],
        };
        setAdminData(mockData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-panel-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <span className="stat-value">{adminData?.totalUsers}</span>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <span className="stat-value">{adminData?.activeUsers}</span>
          </div>
          <div className="stat-card">
            <h3>Average Score</h3>
            <span className="stat-value">{adminData?.averageScore}</span>
          </div>
          <div className="stat-card">
            <h3>New Users Today</h3>
            <span className="stat-value">{adminData?.newUsersToday}</span>
          </div>
        </div>

        <div className="system-health">
          <h3>System Health</h3>
          <div className="health-bar">
            <div className="health-fill" style={{ width: `${adminData?.systemHealth}%` }}></div>
          </div>
          <span>{adminData?.systemHealth}%</span>
        </div>

        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <ul>
            {adminData?.recentActivities?.map((activity, index) => (
              <li key={index}>
                <span className="user">{activity.user}</span>
                <span className="action">{activity.action}</span>
                <span className="time">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

