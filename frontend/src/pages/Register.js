import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

function Register({ setAuth }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '', first_name: '', last_name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password2) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/users/register/`, formData);
            localStorage.setItem('access_token', res.data.tokens.access);
            localStorage.setItem('refresh_token', res.data.tokens.refresh);
            setAuth(true);
            navigate('/dashboard');
        } catch (err) {
            const e = err.response?.data;
            setError(typeof e === 'object' ? Object.values(e).flat().join(', ') : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inp = { padding: '13px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', fontFamily: "'DM Sans',sans-serif", background: 'white', width: '100%', boxSizing: 'border-box' };

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box}`}</style>
            <div style={s.container}>
                <div style={s.topBar}>
                    <Link to="/login" style={s.back}>← Back to Login</Link>
                    <span style={s.logo}>✦ Memoria</span>
                    <div style={{ width: '80px' }} />
                </div>
                <div style={s.card}>
                    <h2 style={s.title}>Create your account</h2>
                    <p style={s.sub}>Start preserving memories today — it's free</p>
                    {error && <div style={s.err}>⚠️ {error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={s.row}>
                            <div style={s.col}>
                                <label style={s.label}>First Name</label>
                                <input style={inp} name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" onFocus={e => e.target.style.borderColor = '#a78bfa'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                            <div style={s.col}>
                                <label style={s.label}>Last Name</label>
                                <input style={inp} name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" onFocus={e => e.target.style.borderColor = '#a78bfa'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Username *</label>
                            <input style={inp} name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" required onFocus={e => e.target.style.borderColor = '#a78bfa'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div style={s.field}>
                            <label style={s.label}>Email *</label>
                            <input style={inp} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@email.com" required onFocus={e => e.target.style.borderColor = '#a78bfa'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>
                        <div style={s.row}>
                            <div style={s.col}>
                                <label style={s.label}>Password *</label>
                                <input style={inp} name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min 8 chars" required onFocus={e => e.target.style.borderColor = '#a78bfa'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                            <div style={s.col}>
                                <label style={s.label}>Confirm *</label>
                                <input style={inp} name="password2" type="password" value={formData.password2} onChange={handleChange} placeholder="Repeat" required onFocus={e => e.target.style.borderColor = '#a78bfa'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                        </div>
                        <button style={loading ? s.btnOff : s.btn} type="submit" disabled={loading}>
                            {loading ? '⟳ Creating...' : 'Create Account →'}
                        </button>
                    </form>
                    <p style={s.switch}>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', fontFamily: "'DM Sans',sans-serif", padding: '24px' },
    container: { maxWidth: '560px', margin: '0 auto' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    back: { color: '#6d28d9', textDecoration: 'none', fontSize: '14px', fontWeight: 500 },
    logo: { fontFamily: "'Playfair Display',serif", color: '#4c1d95', fontSize: '20px', fontWeight: 700 },
    card: { background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 60px rgba(109,40,217,0.1)' },
    title: { fontFamily: "'Playfair Display',serif", fontSize: '30px', color: '#1e1b4b', margin: '0 0 8px' },
    sub: { color: '#64748b', margin: '0 0 24px', fontWeight: 300 },
    err: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', color: '#dc2626', fontSize: '14px', marginBottom: '16px' },
    row: { display: 'flex', gap: '16px', marginBottom: '16px' },
    col: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
    field: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 500, color: '#374151' },
    btn: { width: '100%', padding: '15px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', marginTop: '8px', fontFamily: "'DM Sans',sans-serif" },
    btnOff: { width: '100%', padding: '15px', background: '#a78bfa', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'not-allowed', marginTop: '8px', fontFamily: "'DM Sans',sans-serif" },
    switch: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' },
    link: { color: '#6d28d9', fontWeight: 500, textDecoration: 'none' },
};

export default Register;
