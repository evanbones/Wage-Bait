import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, User, Trash2, ChevronDown, ChevronRight, CornerDownRight, Reply } from 'lucide-react';

const Comments = ({ jobId, comments: initialComments, onCommentAdded }) => {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            alert('Please log in to comment.');
            return;
        }

        if (!newComment.trim()) return;

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser._id || currentUser.id,
                    username: currentUser.username,
                    profilePic: currentUser.profilePic,
                    text: newComment
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.job.comments);
                setNewComment('');
                setIsExpanded(true);
                if (onCommentAdded) onCommentAdded(data.job.comments);
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to post comment.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser._id || currentUser.id
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.job.comments);
                if (onCommentAdded) onCommentAdded(data.job.comments);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete comment.');
            }
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('An error occurred. Please try again.');
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        
        if (!currentUser) {
            alert('Please log in to reply.');
            return;
        }

        if (!replyText.trim()) return;
        setSubmitting(true);

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/comments/${commentId}/replies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser._id || currentUser.id,
                    username: currentUser.username,
                    profilePic: currentUser.profilePic,
                    text: replyText
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.job.comments);
                setReplyingTo(null);
                setReplyText('');
                if (onCommentAdded) onCommentAdded(data.job.comments);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to post reply.');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReply = async (commentId, replyId) => {
        if (!window.confirm('Are you sure you want to delete this reply?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/comments/${commentId}/replies/${replyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser._id || currentUser.id
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.job.comments);
                if (onCommentAdded) onCommentAdded(data.job.comments);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete reply.');
            }
        } catch (err) {
            console.error('Error deleting reply:', err);
            alert('An error occurred. Please try again.');
        }
    };

    const sortedComments = sortOrder === 'newest' 
        ? [...comments].reverse() 
        : comments;

    return (
        <div className="mt-12 pt-8 border-t border-brand-secondary/20">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-brand-accent-light text-brand-primary">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif text-brand-primary">
                    Discussion
                </h3>
            </div>

            <form onSubmit={handleSubmit} className="mb-10">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Leave a comment..."
                        className="w-full p-5 bg-brand-surface border border-brand-secondary/30 rounded-2xl focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all resize-none h-32 shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="absolute bottom-4 right-4 bg-brand-primary text-brand-surface p-3 rounded-xl disabled:opacity-50 hover:bg-brand-secondary transition-all transform active:scale-95 shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </form>

            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2 text-brand-primary">
                    <h4 className="font-bold text-lg">
                        {comments.length} {comments.length === 1 ? 'Thread' : 'Threads'}
                    </h4>
                </div>

                <div className="flex items-center gap-3">
                    {isExpanded && comments.length > 1 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-surface rounded-xl border border-brand-secondary/10 animate-in fade-in zoom-in-95 duration-200">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-secondary whitespace-nowrap">Sort:</span>
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="bg-transparent text-xs font-bold text-brand-primary outline-none cursor-pointer"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    )}

                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 hover:bg-brand-secondary/5 px-4 py-2 rounded-xl transition-all text-brand-secondary hover:text-brand-primary group"
                    >
                        <span className="text-sm font-bold">{isExpanded ? 'Hide' : 'Show'}</span>
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                        ) : (
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                        )}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    {comments.length === 0 ? (
                        <div className="text-center py-10 bg-brand-background rounded-2xl border-2 border-dashed border-brand-secondary/10">
                            <p className="text-brand-secondary italic">No comments yet. Be the first to start the conversation!</p>
                        </div>
                    ) : (
                        sortedComments.map((comment, index) => (
                            <div key={comment._id || index} className="flex flex-col gap-4 p-5 bg-brand-surface rounded-2xl shadow-sm border border-brand-secondary/10 group transition-colors hover:border-brand-accent/30">
                                {/* parent comment */}
                                <div className="flex gap-4">
                                    <Link to={`/user/${comment.username}?fromJob=${jobId}`} className="shrink-0 block hover:opacity-80 transition-opacity">
                                        {comment.profilePic ? (
                                            <img 
                                                src={comment.profilePic} 
                                                alt={comment.username} 
                                                className="w-12 h-12 rounded-full object-cover border-2 border-brand-accent/10"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary border-2 border-brand-accent/10">
                                                <User className="w-6 h-6" />
                                            </div>
                                        )}
                                    </Link>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Link to={`/user/${comment.username}?fromJob=${jobId}`} className="font-bold text-brand-primary hover:text-brand-accent transition-colors">
                                                    {comment.username}
                                                </Link>
                                                <span className="text-xs text-brand-secondary font-medium px-2 py-0.5 bg-brand-background rounded-full">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button 
                                                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                    className="text-brand-secondary hover:text-brand-primary p-1.5 hover:bg-brand-secondary/10 rounded-lg flex items-center gap-1 text-xs font-bold"
                                                >
                                                    <Reply className="w-3.5 h-3.5" />
                                                    Reply
                                                </button>
                                                {currentUser && (currentUser._id === comment.userId || currentUser.id === comment.userId || currentUser.role === 'admin') && (
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-brand-secondary hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg"
                                                        title="Delete comment"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-brand-primary/80 leading-relaxed text-[15px]">{comment.text}</p>
                                    </div>
                                </div>

                                {/* reply input box */}
                                {replyingTo === comment._id && (
                                    <div className="ml-16 mt-2 animate-in slide-in-from-top-2 duration-200">
                                        <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="flex gap-2">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write a reply..."
                                                className="flex-1 p-3 bg-brand-background border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                                            />
                                            <button 
                                                type="submit"
                                                disabled={!replyText.trim() || submitting}
                                                className="px-4 py-2 bg-brand-primary text-brand-surface rounded-xl font-bold hover:bg-brand-secondary disabled:opacity-50 transition-all text-sm"
                                            >
                                                Send
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                className="px-4 py-2 text-brand-secondary font-bold hover:text-brand-primary text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-4 space-y-4 ml-8 border-l-2 border-brand-secondary/10 pl-6 relative">
                                        {comment.replies.map((reply, rIndex) => (
                                            <div key={reply._id || rIndex} className="flex gap-3 relative group/reply">
                                                <CornerDownRight className="w-4 h-4 text-brand-secondary/30 absolute -left-10 top-3" />
                                                <Link to={`/user/${reply.username}?fromJob=${jobId}`} className="shrink-0 block hover:opacity-80 transition-opacity">
                                                    {reply.profilePic ? (
                                                        <img 
                                                            src={reply.profilePic} 
                                                            alt={reply.username} 
                                                            className="w-8 h-8 rounded-full object-cover border border-brand-accent/20"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary border border-brand-accent/20">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </Link>
                                                <div className="flex-1 bg-brand-background/50 p-3 rounded-2xl rounded-tl-none border border-brand-secondary/5">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={`/user/${reply.username}?fromJob=${jobId}`} className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors">
                                                                {reply.username}
                                                            </Link>
                                                            <span className="text-[10px] text-brand-secondary font-medium uppercase">
                                                                {new Date(reply.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {currentUser && (currentUser._id === reply.userId || currentUser.id === reply.userId || currentUser.role === 'admin') && (
                                                            <button 
                                                                onClick={() => handleDeleteReply(comment._id, reply._id)}
                                                                className="text-brand-secondary hover:text-red-500 opacity-0 group-hover/reply:opacity-100 transition-all p-1 hover:bg-red-50 rounded"
                                                                title="Delete reply"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-brand-primary/80 text-sm leading-relaxed">{reply.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Comments;