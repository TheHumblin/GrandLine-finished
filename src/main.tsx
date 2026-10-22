import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/index.css'
import { installAdBlocker } from '@/lib/adBlocker';

// Install permanent ad/popup blocker — runs once at app start, never torn down
installAdBlocker();

createRoot(document.getElementById("root")!).render(<App />);
