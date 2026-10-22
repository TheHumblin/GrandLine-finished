import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ThemeController from '@/components/layout/ThemeController';
import Index from "./pages/Index";
import Episodes from "./pages/Episodes";
import Watch from "./pages/Watch";
import Movies from "./pages/Movies";
import WatchMovie from "./pages/WatchMovie";
import Manga from "./pages/Manga";
import OnePace from "./pages/OnePace";
import Encyclopedia from "./pages/Encyclopedia";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
const WatchParty = lazy(() => import('@/pages/WatchParty'));
import ArcProgress from "./pages/ArcProgress";
import WatchHistory from "./pages/WatchHistory";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Specials from "./pages/Specials";
import WatchSpecial from "./pages/WatchSpecial";
import WatchOrder from "./pages/WatchOrder";
import Gacha from "./pages/Gacha";
import Shop from "./pages/Shop";
import LiveAction from "./pages/LiveAction";
import Downloads from "./pages/Downloads";
import Races from "./pages/Races";
import DenDenMushi from "./components/features/DenDenMushi";
import RedirectGuard from "./components/features/RedirectGuard";
import NotFound from "./pages/NotFound";

const OVAs = lazy(() => import('@/pages/OVAs'));
const WatchOVA = lazy(() => import('@/pages/WatchOVA'));
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeController />
        <Navbar />
        <DenDenMushi />
        <RedirectGuard />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/watch/:number" element={<Watch />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<WatchMovie />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/one-pace" element={<OnePace />} />
          <Route path="/encyclopedia" element={<Encyclopedia />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/watch-party" element={<Suspense fallback={<main role="status" className="min-h-screen bg-background p-8 text-base text-foreground">Loading Crew Watch Party…</main>}><WatchParty /></Suspense>} />
          <Route path="/arc-progress" element={<ArcProgress />} />
          <Route path="/watch-history" element={<WatchHistory />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/specials" element={<Specials />} />
          <Route path="/specials/:id" element={<WatchSpecial />} />
          <Route path="/ovas" element={<Suspense fallback={<main role="status" className="min-h-screen bg-background p-8 text-base text-foreground">Loading OVA catalog…</main>}><OVAs /></Suspense>} />
          <Route path="/ovas/:id" element={<Suspense fallback={<main role="status" className="min-h-screen bg-background p-8 text-base text-foreground">Loading OVA player…</main>}><WatchOVA /></Suspense>} />
          <Route path="/watch-order" element={<WatchOrder />} />
          <Route path="/gacha" element={<Gacha />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/live-action" element={<LiveAction />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/races" element={<Races />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
