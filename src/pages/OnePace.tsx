import { useState } from 'react';
import { Zap, ChevronDown, Info, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

// All arcs from the Google Doc with their episode counts and available versions
const ONE_PACE_ARCS = [
  {
    id: 'romance-dawn', title: 'Romance Dawn', mangaChapters: 'Ch. 1–7', originalEps: 'Ep. 1–3', epCount: 4,
    versions: ['English Subtitles', 'English Dub', 'English Dub with Closed Captions'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'orange-town', title: 'Orange Town', mangaChapters: 'Ch. 8–21', originalEps: 'Ep. 4–8', epCount: 3,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'syrup-village', title: 'Syrup Village', mangaChapters: 'Ch. 22–41', originalEps: 'Ep. 9–18', epCount: 7,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'gaimon', title: 'Gaimon', mangaChapters: 'Ch. 22 (standalone)', originalEps: 'Ep. 8', epCount: 1,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'baratie', title: 'Baratie', mangaChapters: 'Ch. 42–68', originalEps: 'Ep. 19–30', epCount: 8,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'arlong-park', title: 'Arlong Park', mangaChapters: 'Ch. 69–95', originalEps: 'Ep. 31–44', epCount: 10,
    versions: ['English Subtitles', 'English Subtitles Extended Cut', 'English Dub', 'English Dub Extended Cut'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'buggy-crew', title: "Adventures of Buggy's Crew", mangaChapters: 'Side story', originalEps: 'Special', epCount: 1,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'loguetown', title: 'Loguetown', mangaChapters: 'Ch. 96–100', originalEps: 'Ep. 45–53', epCount: 3,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p'],
  },
  {
    id: 'reverse-mountain', title: 'Reverse Mountain', mangaChapters: 'Ch. 101–105', originalEps: 'Ep. 62–63', epCount: 2,
    versions: ['English Subtitles', 'English Subtitles Extended Cut', 'English Dub', 'English Dub Extended Cut'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'whisky-peak', title: 'Whisky Peak', mangaChapters: 'Ch. 106–114', originalEps: 'Ep. 64–67', epCount: 2,
    versions: ['English Subtitles'],
    qualities: ['480p'],
  },
  {
    id: 'koby-meppo', title: 'Trials of Koby-Meppo', mangaChapters: 'Side story', originalEps: 'Special', epCount: 1,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['720p'],
  },
  {
    id: 'little-garden', title: 'Little Garden', mangaChapters: 'Ch. 115–129', originalEps: 'Ep. 70–77', epCount: 5,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'drum-island', title: 'Drum Island', mangaChapters: 'Ch. 130–154', originalEps: 'Ep. 78–91', epCount: 8,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['720p'],
  },
  {
    id: 'alabasta', title: 'Alabasta', mangaChapters: 'Ch. 155–216', originalEps: 'Ep. 92–130', epCount: 21,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'jaya', title: 'Jaya', mangaChapters: 'Ch. 218–236', originalEps: 'Ep. 144–152', epCount: 8,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['720p'],
  },
  {
    id: 'skypiea', title: 'Skypiea', mangaChapters: 'Ch. 237–302', originalEps: 'Ep. 153–195', epCount: 25,
    versions: ['English Subtitles', 'English Subtitles Alt Cut (G-8)', 'English Dub', 'English Dub Alt Cut (G-8)'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'long-ring', title: 'Long Ring Long Land', mangaChapters: 'Ch. 303–321', originalEps: 'Ep. 207–219', epCount: 7,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'water-seven', title: 'Water Seven', mangaChapters: 'Ch. 322–374', originalEps: 'Ep. 229–263', epCount: 20,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['720p'],
  },
  {
    id: 'enies-lobby', title: 'Enies Lobby', mangaChapters: 'Ch. 375–430', originalEps: 'Ep. 264–312', epCount: 25,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'post-enies', title: 'Post-Enies Lobby', mangaChapters: 'Ch. 431–441', originalEps: 'Ep. 313–325', epCount: 5,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'thriller-bark', title: 'Thriller Bark', mangaChapters: 'Ch. 442–489', originalEps: 'Ep. 337–381', epCount: 22,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'sabaody', title: 'Sabaody Archipelago', mangaChapters: 'Ch. 490–513', originalEps: 'Ep. 385–405', epCount: 11,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'amazon-lily', title: 'Amazon Lily', mangaChapters: 'Ch. 514–524', originalEps: 'Ep. 408–421', epCount: 5,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'impel-down', title: 'Impel Down', mangaChapters: 'Ch. 525–549', originalEps: 'Ep. 422–458', epCount: 10,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'straw-hats-adventures', title: 'If You Could Go Anywhere...', mangaChapters: 'Special', originalEps: 'Special', epCount: 1,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p'],
  },
  {
    id: 'marineford', title: 'Marineford', mangaChapters: 'Ch. 550–597', originalEps: 'Ep. 459–489', epCount: 17,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'post-war', title: 'Post-War', mangaChapters: 'Ch. 598–614', originalEps: 'Ep. 490–516', epCount: 8,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['720p'],
  },
  {
    id: 'return-sabaody', title: 'Return to Sabaody', mangaChapters: 'Ch. 598–603', originalEps: 'Ep. 517–522', epCount: 3,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['720p'],
  },
  {
    id: 'fishman-island', title: 'Fishman Island', mangaChapters: 'Ch. 604–653', originalEps: 'Ep. 523–574', epCount: 24,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'punk-hazard', title: 'Punk Hazard', mangaChapters: 'Ch. 654–699', originalEps: 'Ep. 575–629', epCount: 22,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'dressrosa', title: 'Dressrosa', mangaChapters: 'Ch. 700–801', originalEps: 'Ep. 629–746', epCount: 48,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'zou', title: 'Zou', mangaChapters: 'Ch. 802–824', originalEps: 'Ep. 751–779', epCount: 10,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'whole-cake', title: 'Whole Cake Island', mangaChapters: 'Ch. 825–902', originalEps: 'Ep. 783–877', epCount: 39,
    versions: ['English Subtitles'],
    qualities: ['720p'],
  },
  {
    id: 'reverie', title: 'Reverie', mangaChapters: 'Ch. 903–908', originalEps: 'Ep. 878–889', epCount: 3,
    versions: ['English Subtitles', 'English Dub'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'wano', title: 'Wano', mangaChapters: 'Ch. 909–1057', originalEps: 'Ep. 890–1085', epCount: 59,
    versions: ['English Subtitles', 'English Subtitles Extended Cut', 'English Dub', 'English Dub Extended Cut'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'egghead', title: 'Egghead', mangaChapters: 'Ch. 1058+', originalEps: 'Ep. 1086+', epCount: 20,
    versions: ['English Subtitles', 'English Subtitles Extended Cut', 'English Dub', 'English Dub Extended Cut'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'fan-letter', title: 'Special: One Piece Fan Letter', mangaChapters: 'Special', originalEps: 'Special', epCount: 1,
    versions: ['English Subtitles'],
    qualities: ['480p', '720p', '1080p'],
  },
  {
    id: 'warship-island', title: 'Special: Warship Island (April Fools 2025)', mangaChapters: 'Filler', originalEps: 'Ep. 54–61', epCount: 1,
    versions: ['English Subtitles'],
    qualities: ['480p', '720p', '1080p'],
  },
];

const GOOGLE_DOC_URL = 'https://docs.google.com/document/d/1jmoVWR--eCtDTnflw2xN5AGdPQPhKdNRMadT_ln-lnY/preview?embedded=true';

export default function OnePace() {
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');
  const [selectedArc, setSelectedArc] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const arc = ONE_PACE_ARCS.find(a => a.id === selectedArc);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30 px-4 sm:px-6 py-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={24} className="text-primary" />
            <h1 className="text-3xl font-bold gold-text">One Pace</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Fan edit removing all anime-original content — pure manga-paced story. Sub/Dub in 480p, 720p, and 1080p.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/40">Filler-Free</span>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/40">Manga-Paced</span>
            <span className="text-xs px-3 py-1 rounded-full bg-green-900/40 text-green-300 border border-green-700/40">{ONE_PACE_ARCS.length} Arcs</span>
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-900/40 text-yellow-300 border border-yellow-700/40">Sub · Dub · H-SUB</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {/* Info banner */}
        <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-700/40 rounded-xl p-4 mb-6 text-sm text-blue-300">
          <Info size={16} className="shrink-0 mt-0.5" />
          <div>
            <strong>How to watch:</strong> Select an arc for its episode reference, then use the streaming links in the document below. If a source blocks embedded viewing, choose “Open full doc” to browse the links in a new tab. GrandLine stays open in your original tab.
            <br />
            <a
              href="https://onepace.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-blue-400 hover:text-blue-300 underline text-xs"
            >
              <ExternalLink size={11} />
              About One Pace — onepace.net
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Arc sidebar */}
          <div className="space-y-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors lg:pointer-events-none"
            >
              Arc List
              <ChevronDown size={14} className={`lg:hidden transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            {(sidebarOpen) && (
              <div className="space-y-0.5 max-h-[60vh] lg:max-h-none overflow-y-auto">
                {ONE_PACE_ARCS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArc(selectedArc === a.id ? null : a.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between text-sm ${
                      selectedArc === a.id
                        ? 'bg-primary/10 border border-primary/40 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                    }`}
                  >
                    <span className="font-medium leading-tight">{a.title}</span>
                    <span className="text-xs opacity-60 shrink-0 ml-2">{a.epCount}ep</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content area */}
          <div>
            {arc ? (
              <div>
                {/* Arc header */}
                <div className="bg-card border border-border rounded-2xl p-5 mb-5">
                  <h2 className="text-xl font-bold gold-text mb-1">{arc.title}</h2>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                    <span>Manga: <span className="text-foreground">{arc.mangaChapters}</span></span>
                    <span>Original: <span className="text-foreground">{arc.originalEps}</span></span>
                    <span>One Pace: <span className="text-primary font-semibold">{arc.epCount} episodes</span></span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Available Versions</div>
                    <div className="flex flex-wrap gap-2">
                      {arc.versions.map(v => (
                        <span key={v} className="px-2.5 py-1 rounded-full text-xs bg-muted border border-border text-foreground">{v}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quality</div>
                    <div className="flex gap-2">
                      {arc.qualities.map(q => (
                        <span key={q} className="px-2.5 py-1 rounded-full text-xs bg-primary/20 border border-primary/40 text-primary font-semibold">{q}</span>
                      ))}
                    </div>
                  </div>

                  {/* Episode grid */}
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Episode reference — use the document links below</div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: arc.epCount }, (_, i) => i + 1).map(n => (
                        <span
                          key={n}
                          className="w-8 h-8 rounded-lg bg-muted/80 border border-border flex items-center justify-center text-xs font-bold text-foreground cursor-default"
                          title={`Episode ${n}`}
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Embedded Google Doc */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">One Pace Episode Links</span>
                    <a
                      href="https://docs.google.com/document/d/1jmoVWR--eCtDTnflw2xN5AGdPQPhKdNRMadT_ln-lnY/preview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink size={11} />
                      Open full doc
                    </a>
                  </div>
                  <iframe
                    src={GOOGLE_DOC_URL}
                    className="w-full"
                    style={{ height: '70vh', border: 'none' }}
                    title="One Pace Episode Links"
                    allow="autoplay; fullscreen"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-foreground">All One Pace Episodes</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Select an arc from the left for details, or browse all links below</p>
                  </div>
                  <a
                    href="https://docs.google.com/document/d/1jmoVWR--eCtDTnflw2xN5AGdPQPhKdNRMadT_ln-lnY/preview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink size={11} />
                    Open full doc
                  </a>
                </div>
                <iframe
                  src={GOOGLE_DOC_URL}
                  className="w-full"
                  style={{ height: '80vh', border: 'none' }}
                  title="One Pace All Episodes"
                  allow="autoplay; fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
