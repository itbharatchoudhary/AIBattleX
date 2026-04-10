import React from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import VerifyEmail from '../components/VerifyEmail';

export default function AuthPage({ 
  view, 
  onLogin, 
  onRegister, 
  onRequireVerification, 
  onSwitchView,
  verificationEmail,
  verificationMessage,
  onVerifyEmail,
  onResendOtp,
  onCancelVerification,
  isSubmitting,
  isResending
}) {
  if (view === 'verify') {
    return (
      <VerifyEmail
        email={verificationEmail}
        message={verificationMessage}
        onVerify={onVerifyEmail}
        onResend={onResendOtp}
        onCancel={onCancelVerification}
        isSubmitting={isSubmitting}
        isResending={isResending}
      />
    );
  }

  if (view === 'login') {
    return (
      <Login
        onLogin={onLogin}
        onRequireVerification={onRequireVerification}
        onSwitchToRegister={() => onSwitchView('register')}
      />
    );
  }

  return (
    <Register
      onRegister={onRegister}
      onRequireVerification={onRequireVerification}
      onSwitchToLogin={() => onSwitchView('login')}
    />
  );
}
