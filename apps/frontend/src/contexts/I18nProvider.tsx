import { createContext, useContext, ReactNode } from 'react';
import { useI18nStore } from '@/stores/i18n.store';

const I18nContext = createContext<{ t: (key: string) => string; language: string; setLanguage: (l: any) => void }>({
  t: (k: string) => k,
  language: 'pt-BR',
  setLanguage: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const { t, language, setLanguage } = useI18nStore();
  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}