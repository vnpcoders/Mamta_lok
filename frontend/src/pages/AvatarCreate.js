import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default function AvatarCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', relationship: '', description: '', gender: 'other' });
    const [img, setImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const inp = { padding: '13px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', fontFamily: "'DM Sans',sans-serif", background: 'white', width: '100%', boxSizing: 'border-box', transition: 'border-color .2s' };
    const focus = e => e.target.style.borderColor = '#a78bfa';
    const blur = e => e.target.style.borderColor = '#e2e8f0';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name) { setError('Name is required'); return; }
        setLoading(true); setError('');
        try {
            const token = localStorage.getItem('access_token');
            const data = new FormData();
            Object.keys(form).forEach(k => data.append(k, form[k]));
            if (img) data.append('profile_image', img);
            const res = await axios.post(`${API_URL}/avatars/`, data, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
            await axios.post(`${API_URL}/avatars/${res.data.id}/finalize/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setSuccess('Avatar created!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) { setError(err.response?.data?.error || 'Failed'); }
        finally { setLoading(false); }
    };

    return (
        <div style={s.page}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box}`}</style>
            <nav style={s.nav}>
                <button style={s.back} onClick={() => navigate('/dashboard')}>← Back</button>
                <span style={s.brand}>✦ Memoria</span>
                <div style={{ width: '60px' }} />
            </nav>
            <div style={s.wrap}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h1 style={s.title}>Create an Avatar</h1>
                    <p style={s.sub}>Bring someone special back to life with AI</p>
                </div>
                <div style={s.progress}>
                    {[1, 2].map(n => (
                        <React.Fragment key={n}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ ...s.stepCircle, ...(step >= n ? s.stepActive : {}) }}>{step > n ? '✓' : n}</div>
                                <span style={{ fontSize: '13px', color: step >= n ? '#4c1d95' : '#94a3b8', fontWeight: step >= n ? 500 : 400 }}>{n === 1 ? 'Basic Info' : 'Photo'}</span>
                            </div>
                            {n < 2 && <div style={{ flex: 1, height: '2px', background: step > n ? '#6d28d9' : '#e2e8f0', margin: '0 8px' }} />}
                        </React.Fragment>
                    ))}
                </div>
                <div style={s.card}>
                    {error && <div style={s.err}>⚠️ {error}</div>}
                    {success && <div style={s.ok}>✅ {success}</div>}
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div>
                                <h3 style={s.stepTitle}>Tell us about them</h3>
                                <div style={s.field}><label style={s.label}>Name *</label><input style={inp} name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mom, Grandpa John..." required onFocus={focus} onBlur={blur} /></div>
                                <div style={s.field}><label style={s.label}>Relationship</label><input style={inp} name="relationship" value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} placeholder="Mother, Father..." onFocus={focus} onBlur={blur} /></div>
                                <div style={s.field}><label style={s.label}>Gender</label>
                                    <select style={{ ...inp, appearance: 'auto' }} name="gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                        <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                    </select>
                                </div>
                                <div style={s.field}><label style={s.label}>Personality Description</label>
                                    <textarea style={{ ...inp, minHeight: '90px', resize: 'vertical' }} name="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="How they spoke, their interests, favorite sayings..." onFocus={focus} onBlur={blur} />
                                </div>
                                <button type="button" style={s.nextBtn} onClick={() => { if (!form.name) { setError('Enter a name'); return; } setError(''); setStep(2); }}>Continue →</button>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <h3 style={s.stepTitle}>Add a photo (optional)</h3>
                                <div style={s.uploadBox} onClick={() => document.getElementById('photo').click()}>
                                    {preview ? <img src={preview} alt="Preview" style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '12px', objectFit: 'cover' }} /> : (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📸</div>
                                            <p style={{ color: '#6d28d9', fontWeight: 500, margin: '0 0 4px' }}>Click to upload</p>
                                            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>JPG, PNG up to 10MB</p>
                                        </div>
                                    )}
                                </div>
                                <input id="photo" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) { setImg(f); setPreview(URL.createObjectURL(f)); } }} />
                                {preview && <button type="button" style={{ background: 'none', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', marginBottom: '16px', fontFamily: "'DM Sans',sans-serif" }} onClick={() => { setPreview(null); setImg(null); }}>Remove photo</button>}
                                <div style={{ background: '#f8f7ff', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#4c1d95', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Summary</p>
                                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}><strong>Name:</strong> {form.name}</p>
                                    {form.relationship && <p style={{ margin: '4px 0', fontSize: '14px', color: '#374151' }}><strong>Relationship:</strong> {form.relationship}</p>}
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" style={s.backBtn2} onClick={() => setStep(1)}>← Back</button>
                                    <button type="submit" style={loading ? s.submitOff : s.submit} disabled={loading}>{loading ? '⟳ Creating...' : '✦ Create Avatar'}</button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', fontFamily: "'DM Sans',sans-serif" },
    nav: { background: 'white', borderBottom: '1px solid #ede9fe', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    back: { color: '#6d28d9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: "'DM Sans',sans-serif", fontWeight: 500 },
    brand: { fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#4c1d95' },
    wrap: { maxWidth: '520px', margin: '0 auto', padding: '32px 24px' },
    title: { fontFamily: "'Playfair Display',serif", fontSize: '34px', color: '#1e1b4b', margin: '0 0 8px' },
    sub: { color: '#64748b', fontWeight: 300, margin: 0 },
    progress: { display: 'flex', alignItems: 'center', marginBottom: '24px' },
    stepCircle: { width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, flexShrink: 0 },
    stepActive: { background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white' },
    card: { background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 20px 60px rgba(109,40,217,.1)' },
    stepTitle: { fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#1e1b4b', margin: '0 0 20px' },
    err: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', color: '#dc2626', fontSize: '14px', marginBottom: '16px' },
    ok: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', color: '#16a34a', fontSize: '14px', marginBottom: '16px' },
    field: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 500, color: '#374151' },
    nextBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
    uploadBox: { border: '2px dashed #c4b5fd', borderRadius: '16px', padding: '32px', textAlign: 'center', cursor: 'pointer', marginBottom: '12px', background: '#faf5ff', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    backBtn2: { flex: 1, padding: '14px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
    submit: { flex: 2, padding: '14px', background: 'linear-gradient(135deg,#4c1d95,#6d28d9)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
    submitOff: { flex: 2, padding: '14px', background: '#a78bfa', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', cursor: 'not-allowed', fontFamily: "'DM Sans',sans-serif" },
};
