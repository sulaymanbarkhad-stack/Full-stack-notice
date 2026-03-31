import React from 'react';

export const CardSkeleton = () => (
  <div style={{
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: 'white',
    border: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflow: 'hidden'
  }}>
    <div className="skeleton-pulse" style={{ height: '0.75rem', width: '30%', borderRadius: '999px', backgroundColor: 'var(--bg)' }}></div>
    <div className="skeleton-pulse" style={{ height: '1.5rem', width: '80%', borderRadius: '4px', backgroundColor: 'var(--bg)' }}></div>
    <div className="skeleton-pulse" style={{ height: '1rem', width: '100%', borderRadius: '4px', backgroundColor: 'var(--bg)' }}></div>
    <div className="skeleton-pulse" style={{ height: '160px', width: '100%', borderRadius: '8px', backgroundColor: 'var(--bg)' }}></div>
    <div className="skeleton-pulse" style={{ height: '0.75rem', width: '40%', borderRadius: '4px', backgroundColor: 'var(--bg)' }}></div>
  </div>
);

export const StatsSkeleton = () => (
  <div style={{
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: 'white',
    border: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  }}>
    <div className="skeleton-pulse" style={{ height: '1rem', width: '50%', borderRadius: '4px', backgroundColor: 'var(--bg)' }}></div>
    <div className="skeleton-pulse" style={{ height: '2rem', width: '30%', borderRadius: '4px', backgroundColor: 'var(--bg)' }}></div>
  </div>
);
