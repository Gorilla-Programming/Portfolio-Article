import API_BASE_URL from '../config';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useArticles } from '../context/ArticleContext';
import { useAuth } from '../context/AuthContext';
import { Check, Trash2, Clock, ShieldCheck, Edit, ExternalLink, Users, FileText, Mail, Phone, Calendar, Plus, X, Save } from 'lucide-react';
import './Admin.css';

const Admin = () => {
    const { articles, approveArticle, deleteArticle } = useArticles();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'users'
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // User Form State
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        phone: '',
        role: 'user'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user?.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleOpenModal = (userToEdit = null) => {
        if (userToEdit) {
            setEditingUser(userToEdit);
            setUserFormData({
                firstName: userToEdit.firstName || '',
                lastName: userToEdit.lastName || '',
                email: userToEdit.email || '',
                username: userToEdit.username || '',
                password: '', // Don't show password
                phone: userToEdit.phone || '',
                role: userToEdit.role || 'user'
            });
        } else {
            setEditingUser(null);
            setUserFormData({
                firstName: '',
                lastName: '',
                email: '',
                username: '',
                password: '',
                phone: '',
                role: 'user'
            });
        }
        setShowUserModal(true);
    };

    const handleCloseModal = () => {
        setShowUserModal(false);
        setEditingUser(null);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        const url = editingUser
            ? `${API_BASE_URL}/api/users/${editingUser._id}`
            : `${API_BASE_URL}/api/users`;
        const method = editingUser ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userFormData)
            });

            if (response.ok) {
                fetchUsers();
                handleCloseModal();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error saving user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Server error while saving user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (!isAuthenticated || user?.role !== 'admin') return null;

    const pendingArticles = articles.filter(art => art.status === 'pending');
    const approvedArticles = articles.filter(art => art.status === 'approved');

    return (
        <div className="admin-container animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">Manage <span>Dashboard</span></h1>
                <p className="page-subtitle">Control your articles and users in one place.</p>
            </header>

            <div className="admin-tabs glass">
                <button
                    className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('articles')}
                >
                    <FileText size={20} /> Articles
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <Users size={20} /> Users
                </button>
            </div>

            {activeTab === 'articles' ? (
                <>
                    <div className="admin-stats glass">
                        <div className="stat-item">
                            <Clock className="stat-icon" />
                            <div>
                                <h3>{pendingArticles.length}</h3>
                                <p>Pending Approval</p>
                            </div>
                        </div>
                        <div className="stat-item">
                            <ShieldCheck className="stat-icon" />
                            <div>
                                <h3>{approvedArticles.length}</h3>
                                <p>Approved Articles</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-section">
                        <h2 className="section-label"><Clock size={18} /> Pending Approval</h2>
                        <div className="pending-list">
                            {pendingArticles.length === 0 ? (
                                <div className="empty-state glass">
                                    <p>No articles pending approval.</p>
                                </div>
                            ) : (
                                pendingArticles.map(article => (
                                    <div key={article.id} className="pending-card glass">
                                        <div className="pending-info">
                                            <h3>{article.title}</h3>
                                            <p>By {article.author} • {article.category} • {article.date}</p>
                                        </div>
                                        <div className="pending-actions">
                                            <Link to={`/admin/edit/${article.id}`} className="edit-btn" title="Edit">
                                                <Edit size={20} />
                                            </Link>
                                            <button
                                                className="approve-btn"
                                                onClick={() => approveArticle(article.id)}
                                                title="Approve"
                                            >
                                                <Check size={20} />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteArticle(article.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="admin-section" style={{ marginTop: '4rem' }}>
                        <h2 className="section-label"><ShieldCheck size={18} /> Published Articles</h2>
                        <div className="pending-list">
                            {approvedArticles.map(article => (
                                <div key={article.id} className="pending-card glass">
                                    <div className="pending-info">
                                        <h3>{article.title}</h3>
                                        <p>By {article.author} • {article.category} • {article.date}</p>
                                    </div>
                                    <div className="pending-actions">
                                        <Link to={`/admin/edit/${article.id}`} className="edit-btn" title="Edit">
                                            <Edit size={20} />
                                        </Link>
                                        <Link to={`/articles/${article.id}`} className="view-btn" title="View Source">
                                            <ExternalLink size={20} />
                                        </Link>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteArticle(article.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="admin-section users-admin-section">
                    <div className="section-header-row user-management-header">
                        <h2 className="section-label"><Users size={18} /> Registered Users</h2>
                        <button className="add-user-btn" onClick={() => handleOpenModal()}>
                            <Plus size={18} /> <span>Add New User</span>
                        </button>
                    </div>

                    <div className="users-list">
                        {loadingUsers ? (
                            <div className="empty-state glass">Loading users...</div>
                        ) : users.length === 0 ? (
                            <div className="empty-state glass">No users found.</div>
                        ) : (
                            users.map(u => (
                                <div key={u._id} className="pending-card glass user-card">
                                    <div className="pending-info">
                                        <div className="user-primary-info">
                                            <h3>{u.firstName} {u.lastName}</h3>
                                            <span className={`role-badge ${u.role}`}>{u.role}</span>
                                        </div>
                                        <div className="user-meta">
                                            <span title="Email"><Mail size={14} /> {u.email || u.username}</span>
                                            {u.phone && <span title="Phone"><Phone size={14} /> {u.phone}</span>}
                                            <span title="Joined"><Calendar size={14} /> {new Date(u.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="pending-actions user-actions">
                                        <button
                                            className="user-edit-btn"
                                            onClick={() => handleOpenModal(u)}
                                            title="Edit User"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        {u.role !== 'admin' && (
                                            <button
                                                className="delete-user-btn"
                                                onClick={() => handleDeleteUser(u._id)}
                                                title="Delete User"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* User Create/Edit Modal */}
            {showUserModal && (
                <div className="modal-overlay animate-fade-in">
                    <div className="modal-content glass animate-slide-up">
                        <div className="modal-header">
                            <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
                            <button className="close-btn" onClick={handleCloseModal}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUserSubmit} className="user-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={userFormData.firstName}
                                        onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={userFormData.lastName}
                                        onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={userFormData.email}
                                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        value={userFormData.phone}
                                        onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={userFormData.username}
                                        onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{editingUser ? 'New Password (leave blank to keep)' : 'Password'}</label>
                                    <input
                                        type="password"
                                        value={userFormData.password}
                                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                                        required={!editingUser}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={userFormData.role}
                                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="save-btn">
                                    <Save size={18} /> {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
