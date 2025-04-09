
import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
