import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Check, Store, Stethoscope, UtensilsCrossed,
  Truck, Briefcase, ShoppingCart, Wrench, Building2, Hotel, Home, Dumbbell, PawPrint, Pill, Hammer
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useNavigate } from 'react-router-dom';

const businessTypes = [
  { id: 'loja', label: 'Loja', icon: ShoppingCart, desc: 'Varejo e comércio' },
  { id: 'clinica', label: 'Clínica', icon: Stethoscope, desc: 'Consultórios médicos' },
  { id: 'restaurante', label: 'Restaurante', icon: UtensilsCrossed, desc: 'Bares e delivery' },
  { id: 'distribuidora', label: 'Distribuidora', icon: Truck, desc: 'Atacado e logística' },
  { id: 'prestadora_servico', label: 'Serviços', icon: Briefcase, desc: 'Serviços profissionais' },
  { id: 'oficina', label: 'Oficina', icon: Wrench, desc: 'Oficinas e reparos' },
  { id: 'escritorio', label: 'Escritório', icon: Building2, desc: 'Administrativo' },
  { id: 'hotel', label: 'Hotel', icon: Hotel, desc: 'Hospedagem' },
  { id: 'imobiliaria', label: 'Imobiliária', icon: Home, desc: 'Imóveis e locações' },
  { id: 'academia', label: 'Academia', icon: Dumbbell, desc: 'Fitness e saúde' },
  { id: 'pet_shop', label: 'Pet Shop', icon: PawPrint, desc: 'Produtos e serviços pet' },
  { id: 'farmacia', label: 'Farmácia', icon: Pill, desc: 'Farmácias e drogarias' },
  { id: 'construtora', label: 'Construtora', icon: Hammer, desc: 'Construção civil' },
];

const steps = [
  { id: 'welcome', title: 'Bem-vindo ao Ferramenta ERP', subtitle: 'Vamos configurar seu sistema em 3 passos rápidos.' },
  { id: 'business', title: 'Qual seu tipo de empresa?', subtitle: 'Adaptamos o ERP automaticamente ao seu segmento.' },
  { id: 'modules', title: 'Módulos Disponíveis', subtitle: 'Estes são os módulos configurados para você.' },
  { id: 'ready', title: 'Tudo Pronto!', subtitle: 'Seu ERP está configurado e pronto para usar.' },
];

export function FirstAccessWizard() {
  const [step, setStep] = useState(0);
  const [selectedBusiness, setSelectedBusiness] = useState('loja');
  const { closeWizard } = useUIStore();
  const navigate = useNavigate();

  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  const handleFinish = () => {
    closeWizard();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Progress */}
        <div className="flex gap-2 p-6 pb-0">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-blue-500' : 'bg-black/5 dark:bg-white/5'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Welcome */}
              {step === 0 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30">
                    <Store size={36} className="text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{steps[0].title}</h1>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{steps[0].subtitle}</p>
                </div>
              )}

              {/* Business Type Selection */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{steps[1].title}</h2>
                  <p className="text-sm text-gray-500">{steps[1].subtitle}</p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto">
                    {businessTypes.map((bt) => (
                      <button
                        key={bt.id}
                        onClick={() => setSelectedBusiness(bt.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                          selectedBusiness === bt.id
                            ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                            : 'border-white/10 bg-white/30 dark:bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <bt.icon size={22} className={selectedBusiness === bt.id ? 'text-blue-500' : 'text-gray-400'} />
                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                          {bt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Modules */}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{steps[2].title}</h2>
                  <p className="text-sm text-gray-500">{steps[2].subtitle}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Dashboard', 'Clientes', 'Produtos', 'Vendas', 'Financeiro', 'Estoque', 'Relatórios', 'Configurações'].map((mod) => (
                      <div key={mod} className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <Check size={14} className="text-emerald-500" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{mod}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Ready */}
              {step === 3 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{steps[3].title}</h2>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                    Seu ERP está otimizado para seu segmento. Navegue pelos módulos e comece a usar agora mesmo.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-0">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${isFirst ? 'invisible' : ''}`}
          >
            <ChevronLeft size={16} />
            Voltar
          </button>

          <button
            onClick={isLast ? handleFinish : () => setStep(step + 1)}
            className="btn-primary text-sm py-2.5 px-5"
          >
            {isLast ? (
              <>Começar a usar</>
            ) : (
              <>
                Próximo
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}