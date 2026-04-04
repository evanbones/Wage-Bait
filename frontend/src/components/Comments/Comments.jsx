import React, { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';

const Comments = ({ jobId, comments: initialComments, onCommentAdded }) => {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) {
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
                    userId: user._id || user.id,
                    username: user.username,
                    profilePic: user.profilePic,
                    text: newComment
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.job.comments);
                setNewComment('');
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

    return (
        <div className="mt-12 pt-8 border-t border-brand-secondary/20">
            <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-6 h-6 text-brand-accent" />
                <h3 className="text-2xl font-serif">Comments ({comments.length})</h3>
            </div>

            {/* comment form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Leave a comment..."
                        className="w-full p-4 bg-brand-surface border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all resize-none h-32"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="absolute bottom-4 right-4 bg-brand-primary text-brand-surface p-2 rounded-full disabled:opacity-50 hover:bg-brand-secondary transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </form>

            {/* comments list */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-brand-secondary italic">No comments yet. Be the first to start the conversation!</p>
                ) : (
                    comments.slice().reverse().map((comment, index) => (
                        <div key={comment._id || index} className="flex gap-4 p-4 bg-brand-surface rounded-xl shadow-sm border border-brand-secondary/10">
                            <div className="shrink-0">
                                {comment.profilePic ? (
                                    <img 
                                        src={comment.profilePic} 
                                        alt={comment.username} 
                                        className="w-10 h-10 rounded-full object-cover border border-brand-secondary/20"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary">
                                        <User className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-brand-primary">{comment.username}</h4>
                                    <span className="text-xs text-brand-secondary">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-brand-primary/80 leading-relaxed">{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
