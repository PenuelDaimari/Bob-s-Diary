import React, { useState, useEffect, useRef } from 'react';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Loader from './components/Loader';
import Modal from './components/Modal';
import { apiFetch, setAccessToken } from './utils/api';
import './styles/global.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showConfirmLogoutAll, setShowConfirmLogoutAll] = useState(false);

  // Toast
  const [toast, setToast] = useState({ msg: '', type: 'success', visible: false });
  const toastTimer = useRef(null);

  function showToast(msg, type = 'success') {
    clearTimeout(toastTimer.current);
    setToast({ msg, type, visible: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      3000
    );
  }

  useEffect(() => {
    (async () => {
      try {

        const refreshData = await apiFetch('/auth/refresh-token', { method: 'GET' });
        
        setAccessToken(refreshData.accessToken);

        const userData = await apiFetch('/auth/get-me', { method: 'GET' });
        
        setUser(userData.user || userData);
        setAuthed(true);
      } catch {
        setAuthed(false);
        setAccessToken(null);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  function onAuth(data) {
    setAccessToken(data.accessToken);
    setUser(data.user);
    setAuthed(true);
  }

  async function handleLogout() {
    try {
      await apiFetch('/auth/logout');
      setUser(null);
      setAuthed(false);
      setAccessToken(null);
      showToast('Logged out.', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function handleLogoutAll() {
    try {
      await apiFetch('/auth/logout-all');
      setUser(null);
      setAuthed(false);
      setAccessToken(null);
      showToast('Logged out of all devices.', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
    setShowConfirmLogoutAll(false);
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader />
      </div>
    );
  }

  if (!authed) {
    return (
      <>
        <Toast {...toast} />
        <AuthPage onAuth={onAuth} showToast={showToast} />
      </>
    );
  }

  return (
    <>
      <Toast {...toast} />
      <Navbar
        user={user}
        onNewEntry={() => {}}
        onLogout={handleLogout}
        onLogoutAll={() => setShowConfirmLogoutAll(true)}
      />
      <HomePage
        user={user}
        showToast={showToast}
        onLogout={handleLogout}
        onLogoutAll={handleLogoutAll}
      />

      {showConfirmLogoutAll && (
        <Modal title="Log out everywhere?" onClose={() => setShowConfirmLogoutAll(false)}>
          <p style={{ color: 'var(--slate)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            This will end your session on all devices, including this one.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-submit"
              style={{ background: 'var(--danger)' }}
              onClick={handleLogoutAll}
            >
              Yes, log out everywhere
            </button>
            <button
              className="btn-submit"
              style={{ background: 'transparent', color: 'var(--navy)', border: '1px solid var(--border)' }}
              onClick={() => setShowConfirmLogoutAll(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}