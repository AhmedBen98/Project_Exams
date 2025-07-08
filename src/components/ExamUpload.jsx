import React from 'react';

function ExamUpload({ onFileChange, onExtract, disabled }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <input
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        style={{
          background: 'rgba(255,255,255,0.13)',
          color: '#232526',
          borderRadius: '8px',
          padding: '8px',
          border: 'none'
        }}
      />
      <button
        onClick={onExtract}
        disabled={disabled}
        style={{
          padding: '8px 18px',
          borderRadius: '8px',
          border: 'none',
          background: disabled
            ? 'rgba(102,126,234,0.4)'
            : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >Extraire Examen</button>
    </div>
  );
}

export default ExamUpload;
