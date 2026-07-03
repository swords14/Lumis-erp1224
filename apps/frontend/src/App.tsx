import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ClientesPage } from '@/pages/ClientesPage';
import { ProdutosPage } from '@/pages/ProdutosPage';
import { VendasPage } from '@/pages/VendasPage';
import { FinanceiroPage } from '@/pages/FinanceiroPage';
import { ConfiguracoesPage } from '@/pages/ConfiguracoesPage';
import { RelatoriosPage } from '@/pages/RelatoriosPage';
import { FornecedoresPage } from '@/pages/FornecedoresPage';
import { ComprasPage } from '@/pages/ComprasPage';
import { EstoquePage } from '@/pages/EstoquePage';
import { UsuariosPage } from '@/pages/UsuariosPage';
import { FirstAccessWizard } from '@/components/onboarding/FirstAccessWizard';
import { CommandPalette } from '@/components/assistant/CommandPalette';

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const { showWizard, theme, setTheme } = useUIStore();

  // Apply theme on mount
  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (theme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <>
      {/* Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* First Access Wizard */}
      {isAuthenticated && showWizard && <FirstAccessWizard />}

      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route
            element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/vendas" element={<VendasPage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          <Route path="/fornecedores" element={<FornecedoresPage />} />
          <Route path="/compras" element={<ComprasPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}
