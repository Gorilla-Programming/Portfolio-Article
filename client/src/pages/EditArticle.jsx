import API_BASE_URL from '../config';
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useArticles } from '../context/ArticleContext';
import { useAuth } from '../context/AuthContext';
import {
    Save, Image as ImageIcon, Link as LinkIcon, Type, CheckCircle,
    Bold, Italic, Heading1, Heading2, Heading3, ChevronLeft, Loader2, Copy, Check,
    List, ListOrdered, Quote, Code, Eye, FileEdit, Columns, Sparkles,
    Tag, User, BookOpen, PenTool
} from 'lucide-react';
import './Post.css';

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { articles, updateArticle } = useArticles();
    const { isAuthenticated, user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    
    // Auto-detect mobile screen width on initial load for optimal default viewMode
    const [viewMode, setViewMode] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 800 ? 'write' : 'split')); // 'write' | 'preview' | 'split'
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [lastUploadedUrl, setLastUploadedUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: 'Development'
    });

    const defaultCategories = ['Development', 'IBM Maximo', 'Java & Spring', 'AI & Vision', 'Architecture', 'DevOps'];
    const existingCategories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));
    const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories])).sort();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user?.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        const article = articles.find(art => String(art.id || art._id) === String(id));
        if (article) {
            setFormData({
                title: article.title || '',
                excerpt: article.excerpt || '',
                content: article.content || '',
                author: article.author || '',
                category: article.category || 'Development'
            });
            if (!defaultCategories.includes(article.category)) {
                setIsCustomCategory(true);
                setCustomCategory(article.category);
            }
        }
    }, [id, articles]);

    const insertFormatting = (prefix, suffix = '') => {
        const textarea = editorRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newContent = `${before}${prefix}${selection}${suffix}${after}`;
        setFormData({ ...formData, content: newContent });

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + selection.length + suffix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        setIsUploading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await response.json();
            if (data.success) {
                setLastUploadedUrl(data.url);
                insertFormatting(`\n![${file.name}](${data.url})\n`);
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error connecting to server for upload.');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(lastUploadedUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
    const charCount = formData.content.length;

    const handleSubmit = (e) => {
        e.preventDefault();
        const articleToSubmit = {
            ...formData,
            category: isCustomCategory ? customCategory : formData.category
        };

        if (isCustomCategory && !customCategory.trim()) {
            alert('Please enter a category name');
            return;
        }

        updateArticle(id, articleToSubmit);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            navigate('/admin');
        }, 1800);
    };

    if (submitted) {
        return (
            <div className="post-container animate-fade-in success-state">
                <div className="glass-card success-card">
                    <div className="success-icon-glow">
                        <CheckCircle size={56} color="#10b981" />
                    </div>
                    <h2>Changes Saved Successfully!</h2>
                    <p>Redirecting you back to the admin manage dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="post-container animate-fade-in">
            {/* Ambient Lighting Mesh */}
            <div className="post-ambient-mesh">
                <div className="post-orb post-orb-orange"></div>
                <div className="post-orb post-orb-emerald"></div>
                <div className="post-grid-overlay"></div>
            </div>

            <div className="article-top-nav">
                <button onClick={() => navigate('/admin')} className="back-link-btn">
                    <ChevronLeft size={18} /> <span>Back to Dashboard</span>
                </button>
            </div>

            <header className="post-page-header">
                <div className="post-status-pill">
                    <span className="post-live-dot"></span>
                    <Sparkles size={13} />
                    <span>CONTENT MANAGEMENT SUITE</span>
                </div>
                <h1 className="post-hero-title">
                    Edit <span className="text-gradient-primary">Article</span>
                </h1>
                <p className="post-hero-sub">
                    Refine article copy, update category tags, and preview live Markdown formatting.
                </p>
            </header>

            <div className="editor-main-card glass-card">
                <form onSubmit={handleSubmit} className="post-form">
                    <div className="editor-meta-grid">
                        <div className="meta-field title-field">
                            <label>Article Headline</label>
                            <input
                                type="text"
                                placeholder="Article Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="meta-row">
                            <div className="meta-field">
                                <label><User size={13} /> Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    readOnly
                                    className="read-only-input"
                                />
                            </div>
                            <div className="meta-field">
                                <label><Tag size={13} /> Category</label>
                                <select
                                    value={isCustomCategory ? 'Others' : formData.category}
                                    onChange={(e) => {
                                        if (e.target.value === 'Others') {
                                            setIsCustomCategory(true);
                                        } else {
                                            setIsCustomCategory(false);
                                            setCustomCategory('');
                                            setFormData({ ...formData, category: e.target.value });
                                        }
                                    }}
                                >
                                    {allCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="Others">+ Custom Category...</option>
                                </select>
                            </div>
                        </div>

                        {isCustomCategory && (
                            <div className="meta-field custom-cat-field animate-fade-in">
                                <label>New Category Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter custom topic..."
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="meta-field">
                            <label>Card Summary / Excerpt</label>
                            <textarea
                                placeholder="Brief summary to display on article cards..."
                                rows="2"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Markdown Studio Editor */}
                    <div className={`studio-editor-box ${viewMode}`}>
                        <div className="studio-toolbar">
                            <div className="format-tools-scroll-wrap">
                                <div className="format-tools-group">
                                    <button type="button" onClick={() => insertFormatting('**', '**')} title="Bold"><Bold size={16} /></button>
                                    <button type="button" onClick={() => insertFormatting('*', '*')} title="Italic"><Italic size={16} /></button>
                                    <button type="button" onClick={() => insertFormatting('> ')} title="Blockquote"><Quote size={16} /></button>
                                    <div className="toolbar-sep"></div>
                                    <button type="button" onClick={() => insertFormatting('# ')} title="Heading 1"><Heading1 size={16} /></button>
                                    <button type="button" onClick={() => insertFormatting('## ')} title="Heading 2"><Heading2 size={16} /></button>
                                    <button type="button" onClick={() => insertFormatting('### ')} title="Heading 3"><Heading3 size={16} /></button>
                                    <div className="toolbar-sep"></div>
                                    <button type="button" onClick={() => insertFormatting('- ')} title="Bullet List"><List size={16} /></button>
                                    <button type="button" onClick={() => insertFormatting('1. ')} title="Numbered List"><ListOrdered size={16} /></button>
                                    <button type="button" onClick={() => insertFormatting('```\n', '\n```')} title="Code Block"><Code size={16} /></button>
                                    <div className="toolbar-sep"></div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        title="Upload & Insert Image"
                                        disabled={isUploading}
                                        className="upload-trigger-btn"
                                    >
                                        {isUploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
                                        <span>{isUploading ? 'Uploading...' : 'Image'}</span>
                                    </button>
                                    <button type="button" onClick={() => insertFormatting('[', '](https://)')} title="Insert Link"><LinkIcon size={16} /></button>
                                </div>
                            </div>

                            <div className="view-mode-group">
                                <button
                                    type="button"
                                    className={viewMode === 'write' ? 'mode-btn active' : 'mode-btn'}
                                    onClick={() => setViewMode('write')}
                                    title="Write Only"
                                >
                                    <FileEdit size={15} /> <span>Write</span>
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'split' ? 'mode-btn active desktop-only-split' : 'mode-btn desktop-only-split'}
                                    onClick={() => setViewMode('split')}
                                    title="Split View"
                                >
                                    <Columns size={15} /> <span>Split</span>
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'preview' ? 'mode-btn active' : 'mode-btn'}
                                    onClick={() => setViewMode('preview')}
                                    title="Live Preview"
                                >
                                    <Eye size={15} /> <span>Preview</span>
                                </button>
                            </div>
                        </div>

                        <div className="studio-canvas">
                            {(viewMode === 'write' || viewMode === 'split') && (
                                <textarea
                                    ref={editorRef}
                                    placeholder="Write your article in Markdown format..."
                                    className="studio-textarea font-mono"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                ></textarea>
                            )}

                            {(viewMode === 'preview' || viewMode === 'split') && (
                                <div className="studio-preview article-markdown-body">
                                    {formData.content ? (
                                        <ReactMarkdown>{formData.content}</ReactMarkdown>
                                    ) : (
                                        <div className="preview-empty-notice">
                                            <BookOpen size={32} />
                                            <span>Live preview will appear here...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="studio-status-bar">
                            <div className="counts-indicator font-mono">
                                <span>{wordCount} words</span>
                                <span className="dot-sep">•</span>
                                <span>{charCount} characters</span>
                            </div>
                            {lastUploadedUrl && (
                                <div className="last-upload-pill">
                                    <span>Uploaded Image</span>
                                    <button type="button" onClick={copyToClipboard} title="Copy URL">
                                        {copySuccess ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="editor-submit-row">
                        <button type="submit" className="btn-primary submit-article-btn">
                            <Save size={16} /> <span>Update Article</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditArticle;
