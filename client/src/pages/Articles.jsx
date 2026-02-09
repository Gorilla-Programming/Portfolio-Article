import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';
import { Calendar, User, ArrowRight, Search, X } from 'lucide-react';
import './Articles.css';

const Articles = () => {
    const { articles } = useArticles();
    const [searchQuery, setSearchQuery] = useState('');

    const approvedArticles = useMemo(() => {
        return articles.filter(art => art.status === 'approved');
    }, [articles]);

    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) return approvedArticles;

        const query = searchQuery.toLowerCase();
        return approvedArticles.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.author.toLowerCase().includes(query) ||
            article.category.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query)
        );
    }, [approvedArticles, searchQuery]);

    return (
        <div className="articles-container animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">Articles & <span>Insights</span></h1>
                <p className="page-subtitle">Expert insights on IBM Maximo Asset Management, Integration, and modern Software Engineering.</p>

                <div className="search-bar-container">
                    <div className="search-bar glass">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, author, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery('')}>
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="search-results-count">
                            Found {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} matching "{searchQuery}"
                        </p>
                    )}
                </div>
            </header>

            <div className="articles-grid">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                        <article key={article.id} className="article-card glass-card">
                            <div className="article-meta">
                                <span className="category-badge">{article.category}</span>
                                <span className="date">
                                    <Calendar size={14} /> {article.date}
                                </span>
                            </div>
                            <h3>{article.title}</h3>
                            <p>{article.excerpt}</p>
                            <div className="article-footer">
                                <div className="author">
                                    <User size={14} /> {article.author}
                                </div>
                                <Link to={`/articles/${article.id}`} className="read-more">
                                    Read More <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="no-results glass-card">
                        <h3>No articles found</h3>
                        <p>Try adjusting your search terms or browsing categories.</p>
                        <button className="reset-btn" onClick={() => setSearchQuery('')}>Clear Search</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
