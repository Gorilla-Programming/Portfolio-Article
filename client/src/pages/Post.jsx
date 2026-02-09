import API_BASE_URL from '../config';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useArticles } from '../context/ArticleContext';
import { useAuth } from '../context/AuthContext';
import {
    Send, Image as ImageIcon, Link as LinkIcon, Type, CheckCircle,
    Bold, Italic, Heading1, Heading2, Heading3, Loader2, Copy, Check,
    List, ListOrdered, Quote, Code, Eye, FileEdit, Maximize2, Minimize2
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

    const defaultCategories = ['Development', 'Design', 'AI', 'Tech', 'Maximo', 'Integration'];
    const existingCategories = Array.from(new Set(articles.map(a => a.category)));
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
                insertFormatting(`![${file.name}](${data.url})`);
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
            setFormData({ title: '', excerpt: '', content: '', author: user ? `${user.firstName} ${user.lastName}` : '', category: 'Development' });
            setIsCustomCategory(false);
            setCustomCategory('');
        }, 3000);
    };

    if (submitted) {
        return (
            <div className="post-container animate-fade-in success-state">
                <div className="glass-card success-card">
                    <CheckCircle size={64} color="var(--primary)" />
                    <h2>Article Submitted!</h2>
                    <p>Your article has been sent for approval. It will appear on the Articles page once reviewed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="post-container animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">Article <span>Editor</span></h1>
                <p className="page-subtitle">Premium Markdown toolkit for professional writing.</p>
            </header>

            <div className="editor-main-layout">
                <form onSubmit={handleSubmit} className="post-form">
                    <div className="editor-meta-grid">
                        <div className="editor-field-group glass">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="Article Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="editor-field-group glass">
                                <label>Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    readOnly
                                />
                            </div>
                            <div className="editor-field-group glass">
                                <label>Category</label>
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
                                    <option value="Others">Others...</option>
                                </select>
                            </div>
                        </div>

                        {isCustomCategory && (
                            <div className="editor-field-group glass animate-fade-in">
                                <input
                                    type="text"
                                    placeholder="Enter New Category Name"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="editor-field-group glass">
                            <label>Summary (Excerpt)</label>
                            <textarea
                                placeholder="Brief summary to display on article cards..."
                                rows="2"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className={`advanced-editor-container glass ${viewMode}`}>
                        <div className="editor-toolbar-advanced">
                            <div className="toolbar-section">
                                <button type="button" onClick={() => insertFormatting('**', '**')} title="Bold"><Bold size={18} /></button>
                                <button type="button" onClick={() => insertFormatting('_', '_')} title="Italic"><Italic size={18} /></button>
                                <button type="button" onClick={() => insertFormatting('> ')} title="Quote"><Quote size={18} /></button>
                                <div className="toolbar-divider"></div>
                                <button type="button" onClick={() => insertFormatting('# ')} title="H1"><Heading1 size={18} /></button>
                                <button type="button" onClick={() => insertFormatting('## ')} title="H2"><Heading2 size={18} /></button>
                                <button type="button" onClick={() => insertFormatting('### ')} title="H3"><Heading3 size={18} /></button>
                                <div className="toolbar-divider"></div>
                                <button type="button" onClick={() => insertFormatting('- ')} title="Bullet List"><List size={18} /></button>
                                <button type="button" onClick={() => insertFormatting('1. ')} title="Numbered List"><ListOrdered size={18} /></button>
                                <button type="button" onClick={() => insertFormatting('```\n', '\n```')} title="Code Block"><Code size={18} /></button>
                                <div className="toolbar-divider"></div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    title="Upload Image"
                                    disabled={isUploading}
                                >
                                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                                </button>
                                <button type="button" onClick={() => insertFormatting('[', '](url)')} title="Link"><LinkIcon size={18} /></button>
                            </div>

                            <div className="toolbar-section view-controls">
                                <button
                                    type="button"
                                    className={viewMode === 'write' ? 'active' : ''}
                                    onClick={() => setViewMode('write')}
                                    title="Write Mode"
                                >
                                    <FileEdit size={18} />
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'split' ? 'active' : ''}
                                    onClick={() => setViewMode('split')}
                                    title="Split View"
                                >
                                    <Maximize2 size={18} />
                                </button>
                                <button
                                    type="button"
                                    className={viewMode === 'preview' ? 'active' : ''}
                                    onClick={() => setViewMode('preview')}
                                    title="Preview Mode"
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="editor-workspace">
                            {(viewMode === 'write' || viewMode === 'split') && (
                                <textarea
                                    ref={editorRef}
                                    placeholder="Unleash your creativity..."
                                    className="advanced-textarea"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                ></textarea>
                            )}
                            {(viewMode === 'preview' || viewMode === 'split') && (
                                <div className="advanced-preview markdown-content">
                                    {formData.content ? (
                                        <ReactMarkdown>{formData.content}</ReactMarkdown>
                                    ) : (
                                        <div className="preview-placeholder">Live preview will appear here...</div>
                                    )}
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

                    <div className="editor-footer">
                        {lastUploadedUrl && (
                            <div className="upload-notice glass animate-fade-in">
                                <p>Successfully Uploaded: <span>{lastUploadedUrl}</span></p>
                                <button type="button" onClick={copyToClipboard} className="icon-btn">
                                    {copySuccess ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                                </button>
                            </div>
                        )}
                        <button type="submit" className="publish-btn-advanced">
                            Submit Article <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Post;
