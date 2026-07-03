import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Search, LayoutGrid, List, AlertTriangle, Edit3, Trash2, ShoppingCart, DollarSign, Tag, Filter, SlidersHorizontal, X, ChevronRight, CheckCircle, BarChart3, TrendingUp, TrendingDown, Box, Barcode, Layers, Sparkles, Star, Download, Upload, ArrowUpDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { produtosService } from '@/lib/services';
import { useI18nStore } from '@/stores/i18n.store';
import toast from 'react-hot-toast';

type ViewMode = 'cards' | 'table';
type StockFilter = 'todos' | 'low' | 'ok';

export function ProdutosPage() {
  const { t } = useI18nStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('todos');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name'|'price'|'stock'>('name');
  const [form, setForm] = useState({ code:'', name:'', description:'', unitOfMeasure:'un', categoryId:'', brand:'', costPrice:0, sellingPrice:0, currentStock:0, minStock:10, isService:false, image:'' });

  const loadData = async () => { setLoading(true); try { const res = await produtosService.list(); setData(res.data||[]); } catch { toast.error(t('errorLoading')); } finally { setLoading(false); } };
  useEffect(()=>{loadData()},[]);

  const filtered = useMemo(()=>{
    let d=data;
    if(search) d=d.filter(p=>p.name?.toLowerCase().includes(search.toLowerCase())||p.code?.toLowerCase().includes(search.toLowerCase()));
    if(stockFilter==='low') d=d.filter(p=>p.currentStock<=p.minStock);
    if(stockFilter==='ok') d=d.filter(p=>p.currentStock>p.minStock);
    if(sortBy==='price') d=[...d].sort((a,b)=>(b.sellingPrice||0)-(a.sellingPrice||0));
    if(sortBy==='stock') d=[...d].sort((a,b)=>(a.currentStock||0)-(b.currentStock||0));
    return d;
  },[data,search,stockFilter,sortBy]);

  const stats={
    total:data.length,
    low:data.filter(p=>p.currentStock<=p.minStock).length,
    revenue:data.reduce((s,p)=>s+p.sellingPrice*p.currentStock,0),
    cost:data.reduce((s,p)=>s+p.costPrice*p.currentStock,0),
    margin:data.filter(p=>p.sellingPrice>0).reduce((s,p)=>s+((p.sellingPrice-p.costPrice)/p.sellingPrice*100),0)/(data.filter(p=>p.sellingPrice>0).length||1)
  };

  const toggleSelect=(id:string)=>setSelectedIds(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const handleSave = async()=>{
    try{
      if(editing){await produtosService.update(editing.id,form as any);toast.success(t('productUpdated'));}
      else{await produtosService.create(form as any);toast.success(t('productCreated'));}
      setModalOpen(false);setEditing(null);
      setForm({code:'',name:'',description:'',unitOfMeasure:'un',categoryId:'',brand:'',costPrice:0,sellingPrice:0,currentStock:0,minStock:10,isService:false,image:''});
      loadData();
    }catch{toast.error(t('errorSaving'));}
  };

  const handleDelete=async(id:string)=>{
    if(!confirm(t('confirmRemoveProducts')))return;
    try{await produtosService.delete(id);toast.success(t('productRemoved'));loadData();}catch{toast.error(t('errorSaving'));}
  };

  const handleBulkDelete=async()=>{
    if(!confirm(`${t('remove')} ${selectedIds.length} ${t('products')}?`))return;
    try{await Promise.all(selectedIds.map(id=>produtosService.delete(id)));toast.success(`${selectedIds.length} ${t('removedProducts')}`);setSelectedIds([]);loadData();}catch{toast.error(t('errorSaving'));}
  };

  const handleEdit=(item:any)=>{
    setEditing(item);
    setForm({code:item.code,name:item.name,description:item.description||'',unitOfMeasure:item.unitOfMeasure||'un',categoryId:item.categoryId||'',brand:item.brand||'',costPrice:item.costPrice,sellingPrice:item.sellingPrice,currentStock:item.currentStock,minStock:item.minStock,isService:item.isService,image:item.image||''});
    setModalOpen(true);
  };

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-medium">{t('inventory')}</span>
            <ChevronRight size={12} className="text-gray-400"/>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">{t('products')}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('products')}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-gray-500">{stats.total} {t('products')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"/>
            <span className="text-sm text-red-500 font-semibold">{stats.low} {t('lowStock')}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"/>
            <span className="text-sm text-gray-400">{t('avgMargin')}: {stats.margin.toFixed(1)}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length>0 && (
            <motion.button initial={{scale:0}} animate={{scale:1}} onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 shadow-lg">
              <Trash2 size={15}/>{t('remove')} ({selectedIds.length})
            </motion.button>
          )}
          <div className="flex items-center gap-0.5 p-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/10">
            {['cards','table'].map(m=>
              <button key={m} onClick={()=>setViewMode(m as ViewMode)} className={`p-2 rounded-lg transition-all ${viewMode===m?'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white':'text-gray-400 hover:text-gray-600'}`}>
                {m==='cards'?<LayoutGrid size={16}/>:<List size={16}/>}
              </button>
            )}
          </div>
          <button onClick={()=>{setEditing(null);setModalOpen(true)}}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25">
            <Plus size={16}/>{t('newProduct')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          {label:t('stockValue'),value:`R$ ${(stats.revenue/100).toFixed(2)}`,icon:DollarSign,color:'from-emerald-500 to-teal-500'},
          {label:t('stockCost'),value:`R$ ${(stats.cost/100).toFixed(2)}`,icon:TrendingDown,color:'from-red-500 to-rose-500'},
          {label:t('lowStock'),value:stats.low,icon:AlertTriangle,color:'from-amber-500 to-orange-500'},
          {label:t('avgMargin'),value:`${stats.margin.toFixed(1)}%`,icon:TrendingUp,color:'from-blue-500 to-indigo-500'},
          {label:t('total'),value:stats.total,icon:Package,color:'from-violet-500 to-purple-500'},
        ].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="glass-card p-4 flex items-center gap-3 cursor-pointer"
            onClick={()=>{if(s.label===t('lowStock'))setStockFilter('low');else if(s.label===t('total')){setStockFilter('todos');setSearch('')}}}>
            <div className={`p-2 rounded-xl bg-gradient-to-br ${s.color}`}><s.icon size={15} className="text-white"/></div>
            <div><p className="text-[11px] text-gray-500">{s.label}</p><p className="text-base font-bold text-gray-900 dark:text-white">{s.value}</p></div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-3"><div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('searchByCode')}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"/>
          {search&&<button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14}/></button>}
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
          {[{label:t('allProducts'),value:'todos'},{label:t('lowStock'),value:'low'},{label:t('okItems'),value:'ok'}].map(f=>
            <button key={f.value} onClick={()=>setStockFilter(f.value as StockFilter)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${stockFilter===f.value?'bg-white dark:bg-white/15 shadow-sm text-gray-900 dark:text-white':'text-gray-500 hover:text-gray-700'}`}>{f.label}</button>
          )}
        </div>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="text-xs px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-white/10 text-gray-600 dark:text-gray-400">
          <option value="name">{t('name')}</option><option value="price">{t('highestPrice')}</option><option value="stock">{t('lowestStock')}</option>
        </select>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} {t('products')}</span>
      </div></div>

      <AnimatePresence mode="wait">
        {viewMode==='cards'?(
          <motion.div key="cards" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.slice(0,30).map((item,i)=>(
                <motion.div key={item.id} layout initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} transition={{delay:i*0.02}}
                  className={`glass-card p-5 cursor-pointer group relative overflow-hidden ${item.currentStock<=item.minStock?'ring-2 ring-red-500/30 bg-red-500/[0.02]':''} ${selectedIds.includes(item.id)?'ring-2 ring-blue-500':''}`}>
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e=>e.stopPropagation()}>
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={()=>toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300 text-blue-500 cursor-pointer"/>
                  </div>
                  {item.currentStock<=item.minStock && <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{t('lowStockAlert')}</div>}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.currentStock<=item.minStock?'from-red-400 to-rose-500':'from-amber-400 to-orange-500'} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>{item.name?.charAt(0)}</div>
                      <div><h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{item.name}</h3><p className="text-xs text-gray-400 font-mono mt-0.5">{item.code}</p></div>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e=>{e.stopPropagation();handleEdit(item)}} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400"><Edit3 size={13}/></button>
                      <button onClick={e=>{e.stopPropagation();handleDelete(item.id)}} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="glass-card p-2.5 text-center"><p className="text-[10px] text-gray-400 mb-0.5">{t('sellingPrice')}</p><p className="text-sm font-bold text-gray-900 dark:text-white">R$ {(item.sellingPrice/100).toFixed(2)}</p></div>
                    <div className="glass-card p-2.5 text-center"><p className="text-[10px] text-gray-400 mb-0.5">{t('costPrice')}</p><p className="text-xs text-gray-500">R$ {(item.costPrice/100).toFixed(2)}</p></div>
                  </div>
                  <div className={`p-2.5 rounded-xl text-center ${item.currentStock<=item.minStock?'bg-red-500/10':'bg-emerald-500/5'}`}>
                    <p className="text-[10px] text-gray-400 mb-0.5">{t('stock').toUpperCase()}</p>
                    <p className={`text-lg font-bold ${item.currentStock<=item.minStock?'text-red-500':'text-emerald-500'}`}>{item.currentStock} <span className="text-xs font-normal">{item.unitOfMeasure}</span></p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400">{t('margin')} {item.costPrice>0?((item.sellingPrice-item.costPrice)/item.sellingPrice*100).toFixed(0):0}%</span>
                    {item.brand&&<span className="flex items-center gap-1 text-gray-400"><Tag size={10}/>{item.brand}</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length===0&&!loading&&(
              <div className="col-span-3 flex flex-col items-center py-20 text-gray-400">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4"><Package size={36} className="opacity-30"/></div>
                <p className="text-sm font-medium mb-1">{t('noProduct')}</p>
                <p className="text-xs">{t('registerFirstProduct')}</p>
                <button onClick={()=>{setEditing(null);setModalOpen(true)}} className="mt-4 btn-primary text-xs">{t('registerProduct')}</button>
              </div>
            )}
          </motion.div>
        ):(
          <motion.div key="table" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="glass-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full">
              <thead><tr className="border-b border-white/10 bg-black/[0.01]">
                <th className="w-10 px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('products')}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('price')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">{t('stock')}</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t('margin')}</th>
                <th className="w-10 px-4 py-3"></th>
              </tr></thead>
              <tbody>
                {filtered.map(item=>(
                  <tr key={item.id} className={`border-b border-white/5 hover:bg-black/[0.02] cursor-pointer ${selectedIds.includes(item.id)?'bg-blue-500/[0.03]':''} ${item.currentStock<=item.minStock?'bg-red-500/[0.02]':''}`}>
                    <td className="px-4 py-3" onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={()=>toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300 text-blue-500 cursor-pointer"/></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.currentStock<=item.minStock?'from-red-400 to-rose-500':'from-amber-400 to-orange-500'} flex items-center justify-center text-white text-xs font-bold`}>{item.name?.charAt(0)}</div><div><p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p><p className="text-[11px] text-gray-400 font-mono">{item.code}</p></div></div></td>
                    <td className="px-4 py-3 text-right"><p className="text-sm font-bold text-gray-900 dark:text-white">R$ {(item.sellingPrice/100).toFixed(2)}</p><p className="text-[10px] text-gray-400">{t('cost')}: R$ {(item.costPrice/100).toFixed(2)}</p></td>
                    <td className="px-4 py-3 text-center hidden md:table-cell"><span className={`text-sm font-bold ${item.currentStock<=item.minStock?'text-red-500':'text-emerald-500'}`}>{item.currentStock} <span className="text-xs font-normal text-gray-400">{item.unitOfMeasure}</span></span>{item.currentStock<=item.minStock&&<AlertTriangle size={12} className="inline ml-1 text-red-400"/>}</td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell"><span className="text-xs text-gray-500">{item.costPrice>0?((item.sellingPrice-item.costPrice)/item.sellingPrice*100).toFixed(0)+'%':'—'}</span></td>
                    <td className="px-4 py-3" onClick={e=>e.stopPropagation()}><div className="flex items-center gap-1"><button onClick={()=>handleEdit(item)} className="p-1.5 rounded-lg hover:bg-black/5 text-gray-400"><Edit3 size={13}/></button><button onClick={()=>handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
            {filtered.length===0&&!loading&&<div className="text-center py-16 text-gray-400"><Package size={36} className="mx-auto mb-3 opacity-30"/><p className="text-sm">{t('noProduct')}</p></div>}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editing?t('editProduct'):t('newProductModal')} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('codeRequired')}</label><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} className="glass-input"/></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('nameRequired')}</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="glass-input"/></div>
          </div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t('description')}</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="glass-input"/></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('unit')}</label><select value={form.unitOfMeasure} onChange={e=>setForm({...form,unitOfMeasure:e.target.value})} className="glass-input"><option value="un">UN</option><option value="kg">KG</option><option value="l">L</option><option value="m">M</option><option value="cx">CX</option></select></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('brand')}</label><input value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="glass-input"/></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('costCents')}</label><input type="number" value={form.costPrice} onChange={e=>setForm({...form,costPrice:+e.target.value})} className="glass-input"/></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('sellCents')}</label><input type="number" value={form.sellingPrice} onChange={e=>setForm({...form,sellingPrice:+e.target.value})} className="glass-input"/></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('currentStock')}</label><input type="number" value={form.currentStock} onChange={e=>setForm({...form,currentStock:+e.target.value})} className="glass-input"/></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">{t('minStock')}</label><input type="number" value={form.minStock} onChange={e=>setForm({...form,minStock:+e.target.value})} className="glass-input"/></div>
          </div>
          <button onClick={handleSave} className="btn-primary w-full justify-center text-sm py-3 mt-2">{editing?t('saveChanges'):t('registerProduct')}</button>
        </div>
      </Modal>
    </motion.div>
  );
}