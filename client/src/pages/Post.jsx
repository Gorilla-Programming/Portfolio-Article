import API_BASE_URL from '../config';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useArticles } from '../context/ArticleContext';
import { useAuth } from '../context/AuthContext';
import {
    Send, Image as ImageIcon, Link as LinkIcon, Type, CheckCircle,
    Bold, Italic, Heading1, Heading2, Heading3, Loader2, Copy, Check,
    List, ListOrdered, Quote, Code, Eye, FileEdit, Columns, Sparkles,
    Tag, User, BookOpen
} from 'lucide-react';
import './Post.css';

const Post = () => {
    const { articles, addArticle } = useArticles();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [viewMode, setViewMode] = useState('split'); // 'write' | 'preview' | 'split'
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [lastUploadedUrl, setLastUploadedUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    // Auth Protection
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: user ? `${user.firstName} ${user.lastName}` : '',
        category: 'Development'
    });

    const defaultCategories = ['Development', 'IBM Maximo', 'Java & Spring', 'AI & Vision', 'Architecture', 'DevOps'];
    const existingCategories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));
    const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories])).sort();

    useEffect(() => {
        if (user && !formData.author) {
            setFormData(prev => ({ ...prev, author: `${user.firstName} ${user.lastName}` }));
        }
    }, [user, formData.author]);

    if (!isAuthenticated) return null;

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
            category: isCustomCategory ? customCategory : formData.category,
            date: new Date().toISOString().split('T')[0]
        };

        if (isCustomCategory && !customCategory.trim()) {
            alert('Please enter a category name');
            return;
        }

        addArticle(articleToSubmit);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            navigate('/articles');
        }, 2200);
    };

    if (submitted) {
        return (
            <div className="post-container animate-fade-in success-state">
                <div className="glass-card success-card">
                    <div className="success-icon-glow">
                        <CheckCircle size={56} color="#10b981" />
                    </div>
                    <h2>Article Submitted Successfully!</h2>
                    <p>Your contribution has been recorded. It will appear on the public hub upon admin review.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="post-container animate-fade-in">
            <header className="post-page-header">
                <div className="badge-pill cyan">
                    <Sparkles size={14} /> Markdown Writing Studio
                </div>
                <h1 className="page-title">
                    Create New <span className="text-gradient-primary">Article</span>
                </h1>
                <p className="page-subtitle">
                    Share your technical expertise with the developer community using our live Markdown editor.
                </p>
            </header>

            <div className="editor-main-card glass-card">
                <form onSubmit={handleSubmit} className="post-form">
                    {/* Metadata Section */}
                    <div className="editor-meta-grid">
                        <div className="meta-field title-field">
                            <label>Article Headline</label>
                            <input
                                type="text"
                                placeholder="e.g., Deep Dive into Maximo Integration Framework (MIF)..."
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
                                    placeholder="Enter your custom topic..."
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
                                placeholder="A concise 1-2 sentence overview to display on article cards and search results..."
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
                                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                                    <span>{isUploading ? 'Uploading...' : 'Image'}</span>
                                </button>
                                <button type="button" onClick={() => insertFormatting('[', '](https://)')} title="Insert Link"><LinkIcon size={16} /></button>
                            </div>

                            <div className="view-mode-group">
                                <button
                                    type="button"
                                    className={viewMode === 'write' ? 'mode-btn active' : 'mode-btn'}
                                    onClick={() => setViewMode('write')}
                                    title="Write Only"
                                >
                                    <FileEdit size={16} /> Write
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'split' ? 'mode-btn active' : 'mode-btn'}
                                    onClick={() => setViewMode('split')}
                                    title="Split View"
                                >
                                    <Columns size={16} /> Split
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'preview' ? 'mode-btn active' : 'mode-btn'}
                                    onClick={() => setViewMode('preview')}
                                    title="Live Preview"
                                >
                                    <Eye size={16} /> Preview
                                </button>
                            </div>
                        </div>

                        <div className="studio-canvas">
                            {(viewMode === 'write' || viewMode === 'split') && (
                                <textarea
                                    ref={editorRef}
                                    placeholder="Write your article in Markdown format here..."
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
                                            <span>Your live Markdown preview will render here...</span>
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

                    {/* Bottom Submit Row */}
                    <div className="editor-submit-row">
                        <button type="submit" className="btn-primary submit-article-btn">
                            <Send size={18} /> Submit Article for Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Post;
