import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const PageWrapper = ({ children }) => {
  useScrollReveal(); // ← agrega esta línea

  return (
    <div className="page-transition" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default PageWrapper;