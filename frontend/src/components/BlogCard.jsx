import React from 'react';
import { fmtDate } from '../utils/api';

export default function BlogCard({ blog, isOwner, onEdit, onDelete, onRead }) {
  return (
    <div className="blog-card">
      <div className="blog-card-date">{fmtDate(blog.createdAt)}</div>
      <div className="blog-card-title">{blog.title}</div>
      <div className="blog-card-body">{blog.content}</div>
      <div className="blog-card-footer">
        <span className="blog-author">
          by {blog.author?.username || 'Unknown Author'}
        </span>
        <div className="blog-actions">
          <button className="blog-action-btn read" onClick={() => onRead(blog)}>
            Read
          </button>
          {isOwner && (
            <>
              <button className="blog-action-btn" onClick={() => onEdit(blog)}>
                Edit
              </button>
              <button
                className="blog-action-btn danger"
                onClick={() => onDelete(blog._id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}