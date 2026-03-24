import React from 'react';

export default function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="detail-item">
          <span className="label">Phone:</span>
          <span className="value">{user?.phone || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="label">Member Since:</span>
          <span className="value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="label">Account Status:</span>
          <span className="value" style={{ color: user?.isActive ? 'green' : 'red' }}>
            {user?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}

