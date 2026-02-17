import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function Login({ setAuth }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/users/login/`, formData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            setAuth(true);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <style>{css}</style>
            <div style={styles.leftPanel}>
                <div style={styles.brand}>
                    <div style={styles.logo}>✦</div>
                    <h1 style={styles.brandName}>Memoria</h1>
                    <p style={styles.brandTagline}>Keep their memory alive, forever</p>
                </div>
                <div style={styles.floatingCards}>
                    {['💬 Talk to loved ones', '🎭 AI-powered avatars', '💝 Cherish memories'].map((t, i) => (
                        <div key={i} style={{ ...styles.floatCard, animationDelay: `${i * 0.3}s` }}>{t}</div>
                    ))}
                </div>
            </div>
            <div style={styles.rightPanel}>
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>Welcome back</h2>
                    <p style={styles.formSubtitle}>Sign in to continue your journey</p>
                    {error && <div style={styles.error}>⚠️ {error}</div>}
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input style={styles.input} name="username" value={formData.username}
                                onChange={handleChange} placeholder="Enter your username" required
                                onFocus={e => e.target.style.borderColor = '#a78bfa'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input style={styles.input} name="password" type="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="Enter your password" required
                                onFocus={e => e.target.style.borderColor = '#a78bfa'}
                                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <button style={loading ? styles.btnDisabled : styles.btn} type="submit" disabled={loading}>
                            {loading ? '⟳ Signing in...' : 'Sign In →'}
                        </button>
                    </form>
                    <p style={styles.switchText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @media(max-width:768px){
    .left-panel{ display: none !important; }
    .right-panel{ width: 100% !important; }
  }
`;

const styles = {
    page: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", background: '#fafafa' },
    leftPanel: { flex: 1, background: 'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 50%,#6d28d9 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', overflow: 'hidden' },
    brand: { textAlign: 'center', zIndex: 1 },
    logo: { fontSize: '64px', marginBottom: '16px', color: '#e9d5ff' },
    brandName: { fontFamily: "'Playfair Display',serif", fontSize: '48px', color: 'white', margin: '0 0 12px', letterSpacing: '-1px' },
    brandTagline: { color: '#c4b5fd', fontSize: '18px', fontWeight: 300 },
    floatingCards: { marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '12px' },
    floatCard: { background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px 20px', color: 'white', fontSize: '14px', animation: 'float 3s ease-in-out infinite' },
    rightPanel: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' },
    formCard: { width: '100%', maxWidth: '420px' },
    formTitle: { fontFamily: "'Playfair Display',serif", fontSize: '36px', color: '#1e1b4b', marginBottom: '8px' },
    formSubtitle: { color: '#64748b', fontSize: '16px', marginBottom: '32px', fontWeight: 300 },
    error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '14px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '14px', fontWeight: 500, color: '#374151' },
    input: { padding: '14px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', fontFamily: "'DM Sans',sans-serif", background: 'white', width: '100%' },
    btn: { padding: '16px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginTop: '8px' },
    btnDisabled: { padding: '16px', background: '#a78bfa', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'not-allowed', fontFamily: "'DM Sans',sans-serif", marginTop: '8px' },
    switchText: { textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' },
    link: { color: '#6d28d9', fontWeight: 500, textDecoration: 'none' },
};

export default Login;
