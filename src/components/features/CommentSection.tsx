import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare, AlertTriangle, ThumbsUp, Eye, Lock,
  Reply, ChevronDown, ChevronUp, Send, Trash2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Props {
  episodeNumber: number;
  userCurrentEpisode?: number;
}

interface DBComment {
  id: string;
  user_id: string;
  episode_number: number;
  text: string;
  is_spoiler: boolean;
  parent_id: string | null;
  likes: number;
  created_at: string;
  profile?: { username: string; progress_data: Record<string, unknown> } | null;
  replies?: DBComment[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getAvatar(profile: DBComment['profile'], fallback: string): string {
  if (!profile) return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(fallback)}`;
  const av = profile.progress_data?.avatar as string | undefined;
  if (av && av.length > 4) return av;
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(profile.username || fallback)}`;
}

interface CommentCardProps {
  comment: DBComment;
  currentUserId?: string;
  likedSet: Set<string>;
  revealedSet: Set<string>;
  onLike: (id: string) => void;
  onReveal: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (comment: DBComment) => void;
  depth?: number;
}

function CommentCard({
  comment, currentUserId, likedSet, revealedSet,
  onLike, onReveal, onDelete, onReply, depth = 0,
}: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(true);
  const replies = comment.replies || [];
  const isSpoilerHidden = comment.is_spoiler && !revealedSet.has(comment.id);
  const isLiked = likedSet.has(comment.id);
  const username = comment.profile?.username || 'Pirate';
  const avatar = getAvatar(comment.profile, username);

  return (
    <div className={`flex gap-2.5 ${depth > 0 ? 'ml-6 pl-3 border-l border-border/50' : ''}`}>
      <img
        src={avatar}
        alt={username}
        className="w-8 h-8 rounded-full border border-border shrink-0 object-cover mt-0.5"
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.dataset.fb) { t.dataset.fb = '1'; t.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(username)}`; }
        }}
      />
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-semibold text-foreground">{username}</span>
          {comment.is_spoiler && (
            <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-yellow-900/50 text-yellow-400 border border-yellow-700/50">
              <AlertTriangle size={9} /> SPOILER
            </span>
          )}
          {depth > 0 && (
            <span className="text-xs text-primary/60 flex items-center gap-0.5">
              <Reply size={9} /> reply
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">{timeAgo(comment.created_at)}</span>
        </div>

        {/* Body */}
        <div className="relative">
          <p className={`text-sm text-muted-foreground leading-relaxed transition-all duration-200 ${isSpoilerHidden ? 'blur-md select-none' : ''}`}>
            {comment.text}
          </p>
          {isSpoilerHidden && (
            <button
              onClick={() => onReveal(comment.id)}
              className="absolute inset-0 flex items-center justify-center gap-1.5 text-xs font-medium text-yellow-400 hover:text-yellow-300"
            >
              <Eye size={13} /> Click to reveal spoiler
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1.5">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ThumbsUp size={11} className={isLiked ? 'fill-current' : ''} />
            {comment.likes}
          </button>
          {currentUserId && (
            <button
              onClick={() => onReply(comment)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Reply size={11} /> Reply
            </button>
          )}
          {currentUserId === comment.user_id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
            >
              <Trash2 size={11} />
            </button>
          )}
          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showReplies ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {/* Nested replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map(reply => (
              <CommentCard
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                likedSet={likedSet}
                revealedSet={revealedSet}
                onLike={onLike}
                onReveal={onReveal}
                onDelete={onDelete}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Recursively find a comment by id across top-level and nested replies */
function findCommentById(list: DBComment[], id: string): DBComment | undefined {
  for (const c of list) {
    if (c.id === id) return c;
    if (c.replies && c.replies.length > 0) {
      const found = findCommentById(c.replies, id);
      if (found) return found;
    }
  }
  return undefined;
}

export default function CommentSection({ episodeNumber, userCurrentEpisode = 0 }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<DBComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [text, setText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<DBComment | null>(null);
  const [revealedSet, setRevealedSet] = useState<Set<string>>(new Set());
  const [likedSet, setLikedSet] = useState<Set<string>>(() => {
    try { return new Set<string>(JSON.parse(localStorage.getItem('grandline_liked_comments') || '[]')); } catch { return new Set<string>(); }
  });

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, user_id, episode_number, text, is_spoiler, parent_id, likes, created_at')
      .eq('episode_number', episodeNumber)
      .order('created_at', { ascending: false });

    if (!data) { setLoadingComments(false); return; }

    // Collect unique user IDs
    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, username, progress_data')
      .in('id', userIds);

    const profileMap: Record<string, DBComment['profile']> = {};
    (profiles || []).forEach(p => { profileMap[p.id] = { username: p.username, progress_data: (p.progress_data as Record<string, unknown>) || {} }; });

    // Attach profiles and nest replies
    const withProfiles = data.map(c => ({ ...c, profile: profileMap[c.user_id] || null, replies: [] as DBComment[] }));
    const topLevel: DBComment[] = [];
    const byId: Record<string, DBComment> = {};
    withProfiles.forEach(c => { byId[c.id] = c; });
    withProfiles.forEach(c => {
      if (c.parent_id && byId[c.parent_id]) {
        byId[c.parent_id].replies!.unshift(c);
      } else {
        topLevel.push(c);
      }
    });

    setComments(topLevel);
    setLoadingComments(false);
  }, [episodeNumber]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || submitting) return;
    setSubmitting(true);

    const { data: inserted, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        episode_number: episodeNumber,
        text: text.trim(),
        is_spoiler: isSpoiler,
        parent_id: replyingTo?.id || null,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to post comment.');
      setSubmitting(false);
      return;
    }

    // If replying, notify the parent comment's author
    if (replyingTo && replyingTo.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: replyingTo.user_id,
        from_user_id: user.id,
        type: 'comment_reply',
        message: `${user.username} replied to your comment on Episode ${episodeNumber}: "${text.trim().slice(0, 60)}${text.trim().length > 60 ? '…' : ''}"`,
        comment_id: inserted?.id || null,
        episode_number: episodeNumber,
      });
    }

    toast.success(replyingTo ? 'Reply posted!' : 'Comment posted!');
    setText('');
    setIsSpoiler(false);
    setReplyingTo(null);
    setSubmitting(false);
    fetchComments();
  };

  const handleLike = async (id: string) => {
    if (likedSet.has(id)) return;
    const next = new Set([...likedSet, id]);
    setLikedSet(next);
    localStorage.setItem('grandline_liked_comments', JSON.stringify([...next]));
    // Search top-level and nested replies for the comment
    const target = findCommentById(comments, id);
    await supabase.from('comments').update({ likes: (target?.likes || 0) + 1 }).eq('id', id);
    fetchComments();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id);
    toast.success('Comment deleted.');
    fetchComments();
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-primary" />
        <h3 className="font-semibold text-lg">Comments</h3>
        <span className="text-sm text-muted-foreground">({totalCount})</span>
      </div>

      {/* Comment / Reply Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          {replyingTo && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
              <Reply size={11} />
              Replying to <strong>{replyingTo.profile?.username || 'Pirate'}</strong>
              <button type="button" onClick={() => setReplyingTo(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}
          <div className="flex gap-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-9 h-9 rounded-full border border-primary/30 shrink-0 object-cover"
              onError={e => { const t = e.currentTarget; if (!t.dataset.fb) { t.dataset.fb='1'; t.src=`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.username)}`; } }}
            />
            <div className="flex-1 space-y-2">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={replyingTo ? `Reply to ${replyingTo.profile?.username || 'Pirate'}...` : 'Share your thoughts about this episode...'}
                className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[72px]"
                maxLength={500}
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setIsSpoiler(!isSpoiler)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isSpoiler
                      ? 'bg-yellow-900/40 border-yellow-600/60 text-yellow-400'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <AlertTriangle size={11} />
                  {isSpoiler ? 'Marked as Spoiler' : 'Mark as Spoiler'}
                </button>
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send size={11} />
                  {submitting ? 'Posting…' : replyingTo ? 'Post Reply' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border">
          <Lock size={16} className="text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline font-medium">Sign in</Link>{' '}
            to join the discussion and reply to comments.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loadingComments ? (
          <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-sm">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading comments…
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm bg-muted/20 rounded-xl border border-border">
            No comments yet for this episode. Be the first!
          </div>
        ) : (
          comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              likedSet={likedSet}
              revealedSet={revealedSet}
              onLike={handleLike}
              onReveal={id => setRevealedSet(prev => new Set([...prev, id]))}
              onDelete={handleDelete}
              onReply={setReplyingTo}
            />
          ))
        )}
      </div>
    </div>
  );
}
