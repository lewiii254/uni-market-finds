
import React from 'react';
import AuthForm from '@/components/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-marketplace-purple">Kuza-Market</h1>
          <p className="mt-2 text-gray-600">Sign in or create an account to continue</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
