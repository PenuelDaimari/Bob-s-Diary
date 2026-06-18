import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import BlogFormModal from '../components/BlogFormModal';
import ReadModal from '../components/ReadModal';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { apiFetch } from '../utils/api';

export default function HomePage({ user, showToast, onLogout, onLogoutAll }) {
  const [blogs, setBlogs] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [tab, setTab] = useState('all');
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [readBlog, setReadBlog] = useState(null);
  const [showConfirmLogoutAll, setShowConfirmLogoutAll] = useState(false);

  useEffect(() => {
    fetchBlogs();
    fetchMyBlogs();
  }, []);

  async function fetchBlogs() {
    setLoadingBlogs(true);
    try {
      const d = await apiFetch('/blogs');
      setBlogs(d.blogs || d || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoadingBlogs(false);
    }
  }

  async function fetchMyBlogs() {
    try {
      const d = await apiFetch('/blogs/my-blogs');
      setMyBlogs(d.blogs || d || []);
    } catch {}
  }

  async function handleDelete(id) {
    if (!confirm('Delete this entry?')) return;
    try {
      await apiFetch(`/blogs/${id}`, { method: 'DELETE' });
      showToast('Entry deleted.', 'success');
      fetchBlogs();
      fetchMyBlogs();
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  async function handleLogoutAll() {
    try {
      await onLogoutAll();
    } finally {
      setShowConfirmLogoutAll(false);
    }
  }

  const myBlogIds = new Set(myBlogs.map((b) => b._id));
  const displayBlogs = tab === 'all' ? blogs : myBlogs;

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="hero-eyebrow">Welcome back</div>
        <h1 className="hero-title">
          Your <em>thoughts,</em>
          <br />
          your story.
        </h1>
        <p className="hero-sub">A quiet corner of the internet. Write freely. Read widely.</p>
        <div className="hero-cta">
          <button className="btn-hero primary" onClick={() => setShowNew(true)}>
            Write today's entry
          </button>
          <button className="btn-hero secondary" onClick={() => setTab('mine')}>
            My diary
          </button>
        </div>
      </div>

      {/* BLOGS */}
      <div className="section">
        <div className="tabs">
          <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
            All Entries
          </button>
          <button className={`tab ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>
            My Entries
          </button>
        </div>

        <div className="section-header">
          <h2 className="section-title">{tab === 'all' ? 'From the diary' : 'Your entries'}</h2>
          <span className="section-count">
            {displayBlogs.length} {displayBlogs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {loadingBlogs ? (
          <Loader />
        ) : displayBlogs.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✒</div>
            <h3>{tab === 'all' ? 'No entries yet' : "You haven't written anything yet"}</h3>
            <p>
              {tab === 'all'
                ? 'Be the first to write something.'
                : 'Start your first diary entry today.'}
            </p>
          </div>
        ) : (
          <div className="blog-grid">
            {displayBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                isOwner={myBlogIds.has(blog._id)}
                onEdit={(b) => setEditBlog(b)}
                onDelete={handleDelete}
                onRead={setReadBlog}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showNew && (
        <BlogFormModal
          onClose={() => setShowNew(false)}
          onSaved={() => { fetchBlogs(); fetchMyBlogs(); }}
          showToast={showToast}
        />
      )}
      {editBlog && (
        <BlogFormModal
          blog={editBlog}
          onClose={() => setEditBlog(null)}
          onSaved={() => { fetchBlogs(); fetchMyBlogs(); }}
          showToast={showToast}
        />
      )}
      {readBlog && <ReadModal blog={readBlog} onClose={() => setReadBlog(null)} />}

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
    </div>
  );
}
