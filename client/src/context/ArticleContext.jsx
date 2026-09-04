import API_BASE_URL from '../config';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ArticleContext = createContext();
const API_URL = `${API_BASE_URL}/api/articles`;

export const useArticles = () => useContext(ArticleContext);

export const ArticleProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setArticles(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setLoading(false);
        }
    };

    const addArticle = async (newArticle) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArticle)
            });
            if (response.ok) fetchArticles();
        } catch (error) {
            console.error('Error adding article:', error);
        }
    };

    const approveArticle = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}/approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                await fetchArticles();
                return { success: true };
            }
        } catch (error) {
            console.error('Error approving article:', error);
            return { success: false, message: error.message };
        }
    };

    const rejectArticle = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'rejected' })
            });
            if (response.ok) {
                await fetchArticles();
                return { success: true };
            }
        } catch (error) {
            console.error('Error rejecting article:', error);
            return { success: false, message: error.message };
        }
    };

    const updateArticle = async (id, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) fetchArticles();
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    const deleteArticle = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    return (
        <ArticleContext.Provider value={{ articles, loading, addArticle, approveArticle, rejectArticle, updateArticle, deleteArticle, refetchArticles: fetchArticles }}>
            {children}
        </ArticleContext.Provider>
    );
};
