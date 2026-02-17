import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default function Chat() {
    const { avatarId } = useParams();
    const navigate = useNavigate();
    const endRef = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [conv, setConv] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);

    useEffect(() => { init(); }, [avatarId]);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

    const init = async () => {
        const token = localStorage.getItem('access_token');
        const h = { Authorization: `Bearer ${token}` };
        try {
            const [avRes, convRes] = await Promise.all([
                axios.get(`${API_URL}/avatars/${avatarId}/`, { headers: h }),
                axios.get(`${API_URL}/conversations/`, { headers: h })
            ]);
            setAvatar(avRes.data);
            let c = convRes.data.find(x => x.avatar === parseInt(avatarId));
            if (!c) { const r = await axios.post(`${API_URL}/conversations/`, { avatar: avatarId }, { headers: h }); c = r.data; }
            setConv(c);
            setMsgs(c.messages || []);
        } catch (e) { console.error(e); }
    };

    const send = async () => {
        if (!text.trim() || !conv || loading) return;
        const msg = text; setText(''); setLoading(true); setTyping(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.post(`${API_URL}/conversations/${conv.id}/send_message/`, { text: msg }, { headers: { Authorization: `Bearer ${token}` } });
            setTyping(false);
            setMsgs(p => [...p, res.data.user_message, res.data.avatar_message]);
        } catch (e) { setTyping(false); setText(msg); }
        finally { setLoading(false); }
    };

    const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
    const time = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const initial = (n) => n?.charAt(0).toUpperCase() || '?';

    if (!avatar) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7ff', fontFamily: "'DM Sans',sans-serif" }}><p style={{ color: '#6d28d9' }}>Loading...</p></div>;

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box} @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Header */}
            <div style={s.header}>
                <button style={s.backBtn} onClick={() => navigate('/dashboard')}>←</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={s.avaCircle}>
                        {avatar.profile_image ? <img src={avatar.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <span style={{ color: 'white', fontSize: '20px', fontFamily: "'Playfair Display',serif" }}>{initial(avatar.name)}</span>}
                    </div>
                    <div>
                        <h2 style={s.avaName}>{avatar.name}</h2>
                        <p style={s.avaRel}>{avatar.relationship || 'Avatar'} • <span style={{ color: '#10b981' }}>Online</span></p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div style={s.msgs}>
                {msgs.length === 0 && !typing && (
                    <div style={s.empty}>
                        <div style={s.emptyAva}>
                            {avatar.profile_image ? <img src={avatar.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <span style={{ fontSize: '36px', fontFamily: "'Playfair Display',serif", color: 'white' }}>{initial(avatar.name)}</span>}
                        </div>
                        <h3 style={s.emptyName}>{avatar.name}</h3>
                        <p style={s.emptyText}>{avatar.description ? `"${avatar.description.slice(0, 100)}..."` : `Start a conversation with ${avatar.name}`}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                            {['How are you?', 'I miss you', 'Tell me a story'].map((t, i) => (
                                <button key={i} onClick={() => setText(t)} style={{ padding: '8px 16px', background: 'white', border: '1.5px solid #c4b5fd', borderRadius: '20px', color: '#6d28d9', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>{t}</button>
                            ))}
                        </div>
                    </div>
                )}

                {msgs.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.sender_type === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end', marginBottom: '8px', animation: 'fadeIn .3s ease' }}>
                        {m.sender_type === 'avatar' && (
                            <div style={s.msgAva}>
                                {avatar.profile_image ? <img src={avatar.profile_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{initial(avatar.name)}</span>}
                            </div>
                        )}
                        <div style={m.sender_type === 'user' ? s.userBubble : s.avaBubble}>
                            <p style={{ margin: '0 0 4px', fontSize: '15px', lineHeight: 1.5, wordBreak: 'break-word' }}>{m.text_content}</p>
                            <span style={{ fontSize: '11px', opacity: 0.6, display: 'block' }}>{time(m.created_at)}</span>
                        </div>
                    </div>
                ))}

                {typing && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <div style={s.msgAva}><span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{initial(avatar.name)}</span></div>
                        <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', boxShadow: '0 2px 8px rgba(109,40,217,.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {[0, 1, 2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', animation: `bounce 1s ease ${i * .15}s infinite` }} />)}
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={s.inputArea}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <textarea style={s.input} value={text} onChange={e => setText(e.target.value)} onKeyDown={onKey} placeholder={`Message ${avatar.name}...`} rows={1} disabled={loading} onFocus={e => e.target.style.borderColor = '#a78bfa'} onBlur={e => e.target.style.borderColor = '#ede9fe'} />
                    <button style={text.trim() && !loading ? s.sendBtn : s.sendOff} onClick={send} disabled={!text.trim() || loading}>{loading ? '⟳' : '↑'}</button>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '11px', margin: '6px 0 0', textAlign: 'center' }}>Enter to send • Shift+Enter for new line</p>
            </div>
        </div>
    );
}

const s = {
    page: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f7ff', fontFamily: "'DM Sans',sans-serif" },
    header: { background: 'white', borderBottom: '1px solid #ede9fe', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 20px rgba(109,40,217,.06)', zIndex: 10 },
    backBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6d28d9', padding: '4px 8px' },
    avaCircle: { width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
    avaName: { fontFamily: "'Playfair Display',serif", fontSize: '18px', color: '#1e1b4b', margin: 0 },
    avaRel: { color: '#64748b', fontSize: '12px', margin: 0 },
    msgs: { flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column' },
    empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 20px', textAlign: 'center' },
    emptyAva: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', overflow: 'hidden' },
    emptyName: { fontFamily: "'Playfair Display',serif", fontSize: '24px', color: '#1e1b4b', margin: '0 0 8px' },
    emptyText: { color: '#64748b', fontStyle: 'italic', maxWidth: '300px', lineHeight: 1.6, fontWeight: 300, margin: 0 },
    msgAva: { width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
    userBubble: { background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', borderRadius: '18px 18px 4px 18px', padding: '10px 14px', maxWidth: '70%', color: 'white' },
    avaBubble: { background: 'white', borderRadius: '18px 18px 18px 4px', padding: '10px 14px', maxWidth: '70%', boxShadow: '0 2px 8px rgba(109,40,217,.08)', color: '#1e1b4b' },
    inputArea: { background: 'white', borderTop: '1px solid #ede9fe', padding: '12px 16px', boxShadow: '0 -1px 20px rgba(109,40,217,.06)' },
    input: { flex: 1, padding: '12px 16px', border: '2px solid #ede9fe', borderRadius: '12px', fontSize: '15px', outline: 'none', fontFamily: "'DM Sans',sans-serif", resize: 'none', lineHeight: 1.5, maxHeight: '120px', transition: 'border-color .2s', width: '100%' },
    sendBtn: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', fontSize: '20px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    sendOff: { width: '44px', height: '44px', borderRadius: '12px', background: '#e2e8f0', color: '#94a3b8', border: 'none', fontSize: '20px', cursor: 'not-allowed', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
