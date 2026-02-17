import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const gradients = ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)', 'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)', 'linear-gradient(135deg,#fa709a,#fee140)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)'];

export default function Dashboard() {
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get(`${API_URL}/avatars/`, { headers: { Authorization: `Bearer ${token}` } });
                setAvatars(res.data);
            } catch (e) { if (e.response?.status === 401) logout(); }
            finally { setLoading(false); }
        })();
    }, []);

    const logout = () => { localStorage.clear(); navigate('/login'); };

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
            <nav style={s.nav}>
                <span style={s.brand}>✦ Memoria</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
                    <button style={s.newBtn} onClick={() => navigate('/avatar/create')}>+ New Avatar</button>
                    <div style={s.ava} onClick={() => setMenu(!menu)}>U</div>
                    {menu && <div style={s.drop}><button style={s.dropItem} onClick={logout}>🚪 Logout</button></div>}
                </div>
            </nav>

            <div style={s.hero}>
                <div>
                    <h1 style={s.heroTitle}>Your Memories</h1>
                    <p style={s.heroSub}>{avatars.length} avatar{avatars.length !== 1 ? 's' : ''} created</p>
                </div>
                <span style={{ fontSize: '80px', color: 'rgba(167,139,250,0.3)' }}>✦</span>
            </div>

            <div style={s.content}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6d28d9', margin: '0 auto 16px', animation: 'pulse 1s infinite' }} />
                        <p style={{ color: '#64748b' }}>Loading...</p>
                    </div>
                ) : avatars.length === 0 ? (
                    <div style={s.empty}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎭</div>
                        <h3 style={s.emptyTitle}>No avatars yet</h3>
                        <p style={s.emptyText}>Create your first AI avatar to start meaningful conversations</p>
                        <button style={s.emptyBtn} onClick={() => navigate('/avatar/create')}>Create Your First Avatar →</button>
                    </div>
                ) : (
                    <div style={s.grid}>
                        {avatars.map((av, i) => (
                            <div key={av.id} style={s.card}>
                                <div style={{ ...s.cardTop, background: av.profile_image ? `url(${av.profile_image}) center/cover` : gradients[i % gradients.length] }}>
                                    {!av.profile_image && <span style={s.initial}>{av.name?.charAt(0).toUpperCase()}</span>}
                                    <span style={s.badge}>{av.status === 'ready' ? '✓ Ready' : '⟳ Setup'}</span>
                                </div>
                                <div style={s.cardBody}>
                                    <h3 style={s.cardName}>{av.name}</h3>
                                    <p style={s.cardRel}>{av.relationship || 'Avatar'}</p>
                                    {av.description && <p style={s.cardDesc}>{av.description.slice(0, 80)}{av.description.length > 80 ? '...' : ''}</p>}
                                    <button style={av.status === 'ready' ? s.chatBtn : s.chatBtnOff}
                                        onClick={() => av.status === 'ready' && navigate(`/chat/${av.id}`)}
                                        disabled={av.status !== 'ready'}>
                                        {av.status === 'ready' ? '💬 Start Chat' : 'Setting up...'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div style={s.addCard} onClick={() => navigate('/avatar/create')}>
                            <div style={s.addIcon}>+</div>
                            <p style={{ color: '#6d28d9', fontWeight: 500, fontSize: '15px', margin: 0 }}>Create New Avatar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: '#f8f7ff', fontFamily: "'DM Sans',sans-serif" },
    nav: { background: 'white', borderBottom: '1px solid #ede9fe', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 20px rgba(109,40,217,.06)' },
    brand: { fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#4c1d95', fontWeight: 700 },
    newBtn: { padding: '8px 18px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
    ava: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontWeight: 600, fontSize: '16px' },
    drop: { position: 'absolute', top: '44px', right: 0, background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,.12)', overflow: 'hidden', minWidth: '140px' },
    dropItem: { width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontFamily: "'DM Sans',sans-serif" },
    hero: { background: 'linear-gradient(135deg,#1e1b4b,#4c1d95)', padding: '40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    heroTitle: { fontFamily: "'Playfair Display',serif", fontSize: '42px', color: 'white', margin: '0 0 8px' },
    heroSub: { color: '#c4b5fd', fontSize: '16px', margin: 0, fontWeight: 300 },
    content: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
    empty: { textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(109,40,217,.06)' },
    emptyTitle: { fontFamily: "'Playfair Display',serif", fontSize: '28px', color: '#1e1b4b', margin: '0 0 12px' },
    emptyText: { color: '#64748b', maxWidth: '400px', margin: '0 auto 28px', lineHeight: 1.6, fontWeight: 300 },
    emptyBtn: { padding: '14px 28px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '24px' },
    card: { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(109,40,217,.08)' },
    cardTop: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    initial: { fontSize: '64px', color: 'rgba(255,255,255,.9)', fontFamily: "'Playfair Display',serif" },
    badge: { position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' },
    cardBody: { padding: '20px' },
    cardName: { fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#1e1b4b', margin: '0 0 4px' },
    cardRel: { color: '#6d28d9', fontSize: '13px', fontWeight: 500, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.5px' },
    cardDesc: { color: '#64748b', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.5, fontWeight: 300 },
    chatBtn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
    chatBtnOff: { width: '100%', padding: '12px', background: '#f1f5f9', color: '#94a3b8', border: 'none', borderRadius: '10px', fontSize: '14px', cursor: 'not-allowed', fontFamily: "'DM Sans',sans-serif" },
    addCard: { border: '2px dashed #c4b5fd', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', cursor: 'pointer' },
    addIcon: { width: '56px', height: '56px', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#6d28d9', marginBottom: '12px' },
};
