import React, { useState } from 'react';
import Modal from './Modal';
import { apiFetch } from '../utils/api';

export default function BlogFormModal({ blog, onClose, onSaved, showToast }) {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErr('Both fields are required.');
      return;
    }
    setLoading(true);
    setErr('');
    try {
      if (blog?._id) {
        await apiFetch(`/blogs/${blog._id}`, { method: 'PUT', body: { title, content } });
        showToast('Entry updated.', 'success');
      } else {
        await apiFetch('/blogs', { method: 'POST', body: { title, content } });
        showToast('New entry published!', 'success');
      }
      onSaved();
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={blog?._id ? 'Edit Entry' : 'New Entry'} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title…"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea
            className="form-input form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today…"
            rows={7}
          />
        </div>
        {err && <div className="form-error">{err}</div>}
        <button className="btn-submit" disabled={loading}>
          {loading ? 'Saving…' : blog?._id ? 'Save Changes' : 'Publish Entry'}
        </button>
      </form>
    </Modal>
  );
}
