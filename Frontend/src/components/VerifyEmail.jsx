import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VerifyEmail({
  email,
  message,
  onVerify,
  onResend,
  onCancel,
  isSubmitting,
  isResending
}) {
  const [otp, setOtp] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">✉️</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Verify Your Email</h1>
            <p className="text-slate-600 dark:text-white/60 mt-2">Enter the OTP sent to <span className="font-semibold text-slate-900 dark:text-white">{email}</span></p>
          </div>

          {message && (
            <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-6 text-sm text-slate-700 dark:text-slate-200">
              {message}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onVerify(otp);
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                placeholder="Enter 6-digit code"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-500 dark:text-white/60 space-y-3">
            <button
              onClick={onResend}
              disabled={isResending}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isResending ? 'Resending…' : 'Resend OTP'}
            </button>
            <button
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
