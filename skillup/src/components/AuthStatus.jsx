import React from 'react';

const AuthStatus = ({ status }) => (
  <div
    id="auth-status"
    className="text-sm font-medium text-yellow-300 mb-4 p-2 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-300 rounded-lg w-full max-w-6xl text-center no-print text-dark-theme"
  >
    {status}
  </div>
);

export default AuthStatus;
