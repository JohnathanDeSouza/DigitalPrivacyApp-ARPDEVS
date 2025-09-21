import React, { useState, useEffect } from 'react';
import { UserCircleIcon, KeyIcon } from '@heroicons/react/24/outline';

// A reusable form section component
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <Icon className="h-8 w-8 mr-3 text-indigo-600" />
      {title}
    </h3>
    {children}
  </div>
);

// A reusable input field component
const InputField = ({ id, label, type, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required
    />
  </div>
);

// Main Profile Component
export default function Profile({ userData, handleUpdateProfile, handleChangePassword, loading, error, success }) {
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  // When the component loads, fill the form with the user's current data
  useEffect(() => {
    if (userData) {
      setProfileForm({
        username: userData.username || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  const onProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const onPasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const onProfileSubmit = (e) => {
    e.preventDefault();
    handleUpdateProfile(profileForm);
  };

  const onPasswordSubmit = (e) => {
    e.preventDefault();
    handleChangePassword(passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '' }); // Clear fields after submission
  };

  if (!userData) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h2>
      
      {/* Success and Error Banners */}
      {success && <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>}
      {error && <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information Form */}
        <FormSection title="Profile Information" icon={UserCircleIcon}>
          <form onSubmit={onProfileSubmit} className="space-y-6">
            <InputField id="username" label="Username" type="text" value={profileForm.username} onChange={onProfileChange} />
            <InputField id="email" label="Email Address" type="email" value={profileForm.email} onChange={onProfileChange} />
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </FormSection>

        {/* Change Password Form */}
        <FormSection title="Change Password" icon={KeyIcon}>
          <form onSubmit={onPasswordSubmit} className="space-y-6">
            <InputField id="currentPassword" label="Current Password" type="password" value={passwordForm.currentPassword} onChange={onPasswordChange} />
            <InputField id="newPassword" label="New Password" type="password" value={passwordForm.newPassword} onChange={onPasswordChange} />
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </FormSection>
      </div>
    </div>
  );
}