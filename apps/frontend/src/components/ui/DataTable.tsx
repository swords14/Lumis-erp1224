import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, ArrowUpDown, Loader2, Inbox } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => ReactNode;
  format?: (value: any) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  pageSize?: number;
  keyExtractor: (item: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  searchable = true,
  pageSize = 20,
  keyExtractor,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  // Filter
  let filtered = data;
  if (search) {
    const q = search.toLowerCase();
    filtered = data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }

  // Sort
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
    });
  }

  // Paginate
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-glass overflow-hidden">
      {/* Header */}
      {searchable && (
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 transition-colors">
            <SlidersHorizontal size={15} />
          </button>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} registros</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400 dark:text-gray-500">
          <Inbox size={40} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">{emptyMessage}</p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && toggleSort(col.key)}
                      className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                        col.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none' : ''
                      } ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                      style={{ width: col.width }}
                    >
                      <div className="flex items-center gap-1.5" style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                        {col.label}
                        {col.sortable && sortKey === col.key && (
                          <ArrowUpDown size={12} className={sortDir === 'desc' ? 'rotate-180' : ''} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginated.map((item, idx) => (
                    <motion.tr
                      key={keyExtractor(item)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => onRowClick?.(item)}
                      className={`border-b border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors ${
                        onRowClick ? 'cursor-pointer' : ''
                      }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${
                            col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {col.render
                            ? col.render(item)
                            : col.format
                            ? col.format(item[col.key])
                            : item[col.key] ?? '—'}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-xs text-gray-400">
                Página {page} de {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        page === pageNum
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}