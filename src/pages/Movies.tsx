import { Link } from 'react-router-dom';
import { Star, Play, Film } from 'lucide-react';
import { MOVIES, MOVIE_HAS_DUB } from '@/data/movies';
import MoviePosterImage from '@/components/features/MoviePosterImage';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

// Gradient backgrounds for movies without a poster image
const FALLBACK_GRADIENTS = [
  'from-blue-950 via-blue-900 to-indigo-950',
  'from-purple-950 via-purple-900 to-violet-950',
  'from-red-950 via-red-900 to-rose-950',
  'from-amber-950 via-amber-900 to-yellow-950',
  'from-teal-950 via-teal-900 to-cyan-950',
  'from-green-950 via-green-900 to-emerald-950',
  'from-orange-950 via-orange-900 to-red-950',
  'from-slate-900 via-slate-800 to-zinc-900',
  'from-indigo-950 via-indigo-900 to-blue-950',
  'from-pink-950 via-pink-900 to-rose-950',
  'from-sky-950 via-sky-900 to-blue-950',
  'from-lime-950 via-lime-900 to-green-950',
  'from-fuchsia-950 via-fuchsia-900 to-purple-950',
  'from-cyan-950 via-cyan-900 to-teal-950',
  'from-yellow-950 via-yellow-900 to-amber-950',
];

function MoviePoster({ movie, watched }: { movie: typeof MOVIES[0]; watched: boolean }) {
  const gradient = FALLBACK_GRADIENTS[(movie.id - 1) % FALLBACK_GRADIENTS.length];

  if (movie.thumbnail) {
    return (
      <div className="relative aspect-[2/3] overflow-hidden">
        <MoviePosterImage src={movie.thumbnail} title={movie.title} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {watched && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500/90 text-white text-xs font-bold">✓</div>
        )}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1 mb-1">
            <Star size={11} className="text-yellow-400 fill-current" />
            <span className="text-yellow-400 text-xs font-semibold">{movie.rating} / 5</span>
            <span className="text-white/60 text-xs ml-auto">{movie.year}</span>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
            <Play size={20} className="text-primary-foreground ml-1" />
          </div>
        </div>
      </div>
    );
  }

  // Styled fallback when no poster is provided
  return (
    <div className={`relative aspect-[2/3] overflow-hidden bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
        <div className="text-4xl font-black text-white/20 mb-2">#{movie.id}</div>
        <div className="text-xs font-bold text-white/70 leading-tight line-clamp-3">{movie.title}</div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      {watched && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500/90 text-white text-xs font-bold">✓</div>
      )}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex items-center gap-1 mb-1">
          <Star size={11} className="text-yellow-400 fill-current" />
          <span className="text-yellow-400 text-xs font-semibold">{movie.rating} / 5</span>
          <span className="text-white/60 text-xs ml-auto">{movie.year}</span>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
          <Play size={20} className="text-primary-foreground ml-1" />
        </div>
      </div>
    </div>
  );
}

export default function Movies() {
  const { user } = useAuth();
  useTheme(user?.theme || 'strawhat');
  const watchedMovies = new Set(user?.watchedMovies || []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/30 px-4 sm:px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Film size={24} className="text-primary" />
            <h1 className="text-3xl font-bold gold-text">One Piece Movies</h1>
          </div>
          <p className="text-muted-foreground">All 15 official One Piece films. Ratings are out of 5.</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOVIES.map(movie => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="card-hover group block bg-card border border-border rounded-xl overflow-hidden"
            >
              <MoviePoster movie={movie} watched={watchedMovies.has(movie.id)} />
              <div className="p-3">
                <div className="text-xs text-muted-foreground mb-1">Movie {movie.id}</div>
                <div className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{movie.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{movie.duration}</span>
                  {MOVIE_HAS_DUB[movie.id] && (
                    <span className="text-xs font-bold text-blue-400">DUB</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
