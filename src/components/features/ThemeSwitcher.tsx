import { Palette } from 'lucide-react';
import { THEMES } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import type { ThemeName } from '@/types';
import { toast } from 'sonner';

export default function ThemeSwitcher() {
  const { user, updateSettings } = useAuth();
  const handleTheme = (theme: ThemeName) => {
    if (!user) return;
    updateSettings({ theme, poneglyphActive: false });
    toast.success(`${THEMES.find(item => item.id === theme)?.name} theme activated.`);
  };
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-base font-medium text-foreground"><Palette size={16} className="text-primary" />Themed UI Skins</h4>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {THEMES.map(theme => {
          const active = user?.theme === theme.id && !user?.poneglyphActive;
          return (
            <button key={theme.id} type="button" onClick={() => handleTheme(theme.id)} disabled={!user} aria-pressed={active} className={`min-h-[44px] rounded-xl border-2 p-3 text-left transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${active ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:border-primary/50'}`}>
              <div className="mb-1 flex items-center gap-2"><span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: theme.primaryColor }} aria-hidden="true" /><span className="text-base font-semibold text-foreground">{theme.name}</span></div>
              <p className="text-base leading-relaxed text-muted-foreground">{theme.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
