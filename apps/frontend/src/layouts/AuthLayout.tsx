import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="flex h-screen">
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Glass overlay decorations */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        
        <div className="relative flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                Lumis
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Gestão empresarial<br />
              <span className="text-blue-200">simples e inteligente</span>
            </h1>
            <p className="text-lg text-blue-100/80 max-w-md">
              O ERP que se adapta ao seu negócio. Fácil de usar, sem manuais,
              sem treinamentos. Apenas resultados.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - Auth Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}