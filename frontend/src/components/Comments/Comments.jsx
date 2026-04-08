import React, { useState } from 'react';
import { MessageSquare, Send, User, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const Comments = ({ jobId, comments: initialComments, onCommentAdded }) => {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

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

            {/* comment form - Always visible */}
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

            {/* Collapsible comments list */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full hover:bg-brand-secondary/5 p-3 rounded-2xl transition-all group"
                aria-expanded={isExpanded}
            >
                <div className="flex items-center gap-2 text-brand-primary">
                    <h4 className="font-bold">
                        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                    </h4>
                </div>
                <div className="flex items-center gap-2 text-brand-secondary group-hover:text-brand-primary transition-colors pr-2">
                    <span className="text-sm font-medium">{isExpanded ? 'Hide' : 'Show'}</span>
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                    ) : (
                        <ChevronRight className="w-5 h-5" />
                    )}
                </div>
            </button>

            {isExpanded && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    {comments.length === 0 ? (
                        <div className="text-center py-10 bg-brand-background rounded-2xl border-2 border-dashed border-brand-secondary/10">
                            <p className="text-brand-secondary italic">No comments yet. Be the first to start the conversation!</p>
                        </div>
                    ) : (
                        comments.slice().reverse().map((comment, index) => (
                            <div key={comment._id || index} className="flex gap-4 p-5 bg-brand-surface rounded-2xl shadow-sm border border-brand-secondary/10 group hover:border-brand-accent/30 transition-colors">
                                <div className="shrink-0">
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
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-brand-primary">{comment.username}</h4>
                                            <span className="text-xs text-brand-secondary font-medium px-2 py-0.5 bg-brand-background rounded-full">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {currentUser && (currentUser._id === comment.userId || currentUser.id === comment.userId) && (
                                            <button 
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="text-brand-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                                                title="Delete comment"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-brand-primary/80 leading-relaxed text-[15px]">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Comments;
