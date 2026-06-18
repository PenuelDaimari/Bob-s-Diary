import React from 'react';
import Modal from './Modal';
import { fmtDate } from '../utils/api';

export default function ReadModal({ blog, onClose }) {
  return (
    <Modal title="" onClose={onClose}>
      <div className="read-title">{blog.title}</div>
      <div className="read-meta">
        {fmtDate(blog.createdAt)} · by {blog.author?.name || blog.authorName || 'Bob'}
      </div>
      <div className="read-body">{blog.content}</div>
    </Modal>
  );
}
