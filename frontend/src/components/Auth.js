import React from 'react';

const LoginForm = ({ handleLogin, loginForm, setLoginForm, setAuthMode, loading, error }) => (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              name="identifier"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username or email"
              value={loginForm.identifier}
              onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </div>
        </div>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-2 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={() => setAuthMode('register')} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </button>
      </p>
    </div>
);
  
const RegistrationForm = ({ handleRegister, registerForm, setRegisterForm, setAuthMode, loading, error }) => (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
      <form className="mt-8 space-y-6" onSubmit={handleRegister}>
        <div className="rounded-md shadow-sm space-y-2">
          <input
            name="username"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
          />
          <input
            name="email"
            type="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Email address"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
          />
          <input
            name="password"
            type="password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
          />
        </div>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="mt-2 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={() => setAuthMode('login')} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </button>
      </p>
    </div>
);

export default function Auth({ authMode, setAuthMode, ...props }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {authMode === 'login' 
                ? <LoginForm setAuthMode={setAuthMode} {...props} /> 
                : <RegistrationForm setAuthMode={setAuthMode} {...props} />
            }
        </div>
    );
}