import React from 'react';

export default function Navbar({ user, onNewEntry, onLogout, onLogoutAll }) {
  return (
    <nav className="nav">
      <div className="nav-logo">Bob's <span>Diary</span></div>
      <div className="nav-actions">
        <span className="nav-user">Hi, {user?.username || `It's Bob`}</span>
        <button className="nav-btn primary" onClick={onNewEntry}>+ New Entry</button>
        <button className="nav-btn" onClick={onLogout}>Log out</button>
        <button
          className="nav-btn"
          onClick={onLogoutAll}
          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
        >
          All devices
        </button>
      </div>
    </nav>
  );
}
