import { ReactNode } from 'react';
import { Lock } from 'lucide-react';

interface PermissionGuardProps {
  module: string;
  action?: 'criar' | 'ler' | 'atualizar' | 'excluir';
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Protege conteúdo baseado em permissões do usuário.
 * Integra com o sistema de RBAC (Role-Based Access Control).
 */
export function PermissionGuard({
  module,
  action = 'ler',
  children,
  fallback,
}: PermissionGuardProps) {
  // Placeholder: no futuro, validar contra as permissões do usuário logado
  const hasPermission = true; // useAuthStore().permissions?.[module]?.includes(action)

  if (!hasPermission) {
    return (
      fallback ?? (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-3">
            <Lock size={20} className="text-red-500" />
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Acesso restrito
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Você não tem permissão para acessar este recurso.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}