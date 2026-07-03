import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Clock, User, FileText, ChevronRight } from 'lucide-react';
import { useI18nStore } from '@/stores/i18n.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Pagination } from '@/components/ui/Pagination';

export function AuditoriaPage() {
  const { t } = useI18nStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadLogs = async () => {
    setLoading(true);
    try {
      const r = await api.get('/audit/logs', { params: { page, limit } });
      setLogs(r.data?.data || []);
      setTotal(r.data?.total || 0);
    } catch {
      toast.error(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, [page]);

  const getActionBadge = (action: string) => {
    const map: Record<string, string> = {
      CREATE: 'bg-emerald-50 text-emerald-700',
      UPDATE: 'bg-blue-50 text-blue-700',
      DELETE: 'bg-red-50 text-red-700',
    };
    return map[action] || 'bg-gray-50 text-gray-600';
  };

  const getActionLabel = (action: string) => {
    const map: Record<string, string> = {
      CREATE: t('create'),
      UPDATE: t('update'),
      DELETE: t('delete'),
    };
    return map[action] || action;
  };

  const getResourceIcon = (resource: string) => {
    return <FileText size={14} />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-400 font-medium">{t('admin')}</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-xs text-gray-600 font-semibold">{t('security')}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Auditoria</h1>
        <p className="text-sm text-gray-500 mt-1">Registro de todas as ações no sistema</p>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
            Carregando...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-black/[0.01]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ação</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recurso</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Usuário</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-black/[0.02]">
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getActionBadge(log.action)}`}>
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getResourceIcon(log.resource)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{log.resource}</span>
                          {log.resource_id && <span className="text-[10px] text-gray-400 font-mono">{log.resource_id.slice(0, 8)}...</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                            {log.user_name?.charAt(0) || '?'}
                          </div>
                          <span className="text-xs text-gray-500">{log.user_name || 'Sistema'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-16 text-gray-400">
                        <Shield size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">Nenhum registro de auditoria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4">
              <Pagination
                page={page}
                totalPages={Math.ceil(total / limit)}
                total={total}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}