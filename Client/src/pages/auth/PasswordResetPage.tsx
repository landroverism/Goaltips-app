
import React from 'react';
import PasswordResetForm from '../../components/auth/PasswordResetForm';

const PasswordResetPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <PasswordResetForm />
      </div>
    </div>
  );
};

export default PasswordResetPage;
