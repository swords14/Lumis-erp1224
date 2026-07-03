import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Command, Fingerprint, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useI18nStore } from '@/stores/i18n.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { LoginResponse } from '@ferramenta/shared';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const { login } = useAuthStore();
  const { t } = useI18nStore();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error(t('fillAllFields')); return; }
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      login(data);
      toast.success(`${t('welcomeBack')}, ${data.user.name.split(' ')[0]}! ✨`);
      navigate('/', { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || t('invalidCredentials');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Focus email on mount
  useEffect(() => { emailRef.current?.focus(); }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-[440px] mx-auto"
    >
      {/* Floating Orbs Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <motion.div
          animate={{ x: [-20, 20, -20], y: [-10, 15, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [20, -15, 20], y: [10, -20, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/5 blur-3xl"
        />
      </div>

      {/* Logo & Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: -3 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-blue-500/30"
        >
          <Command size={28} className="text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent leading-tight">
          {t('erpTitle')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
          {t('erpSubtitle')}
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
        className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/75 dark:bg-white/[0.06] backdrop-blur-3xl shadow-2xl shadow-black/[0.03] dark:shadow-black/20"
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-7"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('login')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('loginDescription')}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                {t('emailLabel')}
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === 'email'
                    ? 'ring-2 ring-blue-500/20 rounded-2xl'
                    : ''
                }`}
              >
                <Mail
                  size={16}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={t('emailPlaceholder')}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-transparent hover:border-black/[0.06] dark:hover:border-white/[0.08] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none transition-all duration-300"
                  autoComplete="email"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
                {t('passwordLabel')}
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === 'password'
                    ? 'ring-2 ring-blue-500/20 rounded-2xl'
                    : ''
                }`}
              >
                <Lock
                  size={16}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-transparent hover:border-black/[0.06] dark:hover:border-white/[0.08] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none transition-all duration-300"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? 'off' : 'on'}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-2xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 flex items-center justify-center gap-2.5 group"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>{t('login')}</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-7 flex items-center justify-between"
          >
            <button className="text-xs text-gray-400 hover:text-blue-500 transition-colors font-medium">
              {t('forgotPassword')}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <UserPlus size={13} />
              <button className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                {t('createAccount')}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Version badge */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-gray-400 mt-6"
      >
        {t('erpTitle')} v1.0.0 •{' '}
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t('online')}
        </span>
      </motion.p>
    </motion.div>
  );
}