
import React from 'react';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
