import React, { useState } from 'react';
import '../styles/info-modal.css';

export default function InfoModal({ title, description, features, icon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="info-button"
        onClick={() => setIsOpen(true)}
        title={`Learn about ${title}`}
      >
        <span className="info-icon">ℹ️</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">{icon}</span>
              <h2>{title}</h2>
              <button 
                className="modal-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">{description}</p>
              
              {features && features.length > 0 && (
                <div className="modal-features">
                  <h3>Key Features:</h3>
                  <ul>
                    {features.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-icon">✓</span>
                        <span className="feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-close"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

