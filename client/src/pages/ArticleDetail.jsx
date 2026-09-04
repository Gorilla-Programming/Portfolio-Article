import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useArticles } from '../context/ArticleContext';
import { ChevronLeft, Calendar, User, Tag, Clock, Share2, Sparkles, BookOpen } from 'lucide-react';
import './ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const { articles } = useArticles();
    const article = articles.find(art => String(art.id || art._id) === String(id));

    // Calculate approximate read time
    const getReadTime = (content = '') => {
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return `${minutes} min read`;
    };

    if (!article) {
        return (
            <div className="article-detail-container animate-fade-in error-page">
                <div className="glass-card error-card">
                    <BookOpen size={48} className="error-icon" />
                    <h2>Article Not Found</h2>
                    <p>The article you are looking for does not exist, has been unpublished, or is pending review.</p>
                    <Link to="/articles" className="btn-primary">
                        <ChevronLeft size={16} /> Back to Articles Hub
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="article-detail-container animate-fade-in">
            {/* Top Navigation */}
            <div className="article-top-nav">
                <Link to="/articles" className="back-link-btn">
                    <ChevronLeft size={18} /> Back to Articles
                </Link>
            </div>

            {/* Article Content Container */}
            <article className="article-full-view glass-card">
                <header className="article-reader-header">
                    <div className="reader-meta-top">
                        <span className="badge-pill cyan">
                            <Tag size={13} /> {article.category || 'Engineering'}
                        </span>
                        <div className="reader-read-time">
                            <Clock size={14} /> {getReadTime(article.content)}
                        </div>
                    </div>

                    <h1 className="reader-title">{article.title}</h1>

                    {article.excerpt && (
                        <p className="reader-excerpt">{article.excerpt}</p>
                    )}

                    <div className="reader-author-bar">
                        <div className="author-left">
                            <div className="author-avatar-large">
                                <User size={18} />
                            </div>
                            <div className="author-info">
                                <span className="author-full-name">{article.author || 'Ankit Chaudhary'}</span>
                                <span className="author-post-date">
                                    <Calendar size={13} /> Published on {article.date || 'Recent'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="article-markdown-body font-inter">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default ArticleDetail;
