import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useArticles } from '../context/ArticleContext';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';
import './ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const { articles } = useArticles();
    const article = articles.find(art => String(art.id) === String(id));

    if (!article) {
        return (
            <div className="article-detail-container animate-fade-in error-page">
                <div className="glass-card error-card">
                    <h2>Article Not Found</h2>
                    <p>The article you are looking for does not exist or has been removed.</p>
                    <Link to="/articles" className="back-link-btn">Back to Articles</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="article-detail-container animate-fade-in">
            <Link to="/articles" className="back-link">
                <ChevronLeft size={20} /> Back to Articles
            </Link>

            <article className="article-full glass-card">
                <header className="article-header">
                    <div className="article-meta">
                        <span className="category-tag"><Tag size={14} /> {article.category}</span>
                        <span className="meta-item"><Calendar size={14} /> {article.date}</span>
                        <span className="meta-item"><User size={14} /> {article.author}</span>
                    </div>
                    <h1>{article.title}</h1>
                    <p className="article-excerpt">{article.excerpt}</p>
                </header>

                <div className="article-content markdown-body">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default ArticleDetail;
