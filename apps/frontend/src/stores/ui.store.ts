import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado' | 'especialista';

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  experienceLevel: ExperienceLevel;
  completedTours: string[];
  dismissedTips: string[];
  showWizard: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  completeTour: (tourId: string) => void;
  dismissTip: (tipId: string) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  closeWizard: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      experienceLevel: 'iniciante',
      completedTours: [],
      dismissedTips: [],
      showWizard: true,

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', prefersDark);
        }
      },

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      completeTour: (tourId) =>
        set((s) => ({
          completedTours: [...new Set([...s.completedTours, tourId])],
        })),

      dismissTip: (tipId) =>
        set((s) => ({
          dismissedTips: [...new Set([...s.dismissedTips, tipId])],
        })),

      setExperienceLevel: (level) => set({ experienceLevel: level }),

      closeWizard: () => set({ showWizard: false }),
    }),
    { name: 'ferramenta-ui' }
  )
);