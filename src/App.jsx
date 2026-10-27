import React, { useState, useEffect } from 'react';
import { 
  Play, Search, Plus, Trash2, Activity, 
  X, Copy, Check, Lock, LogOut, FolderDown 
} from 'lucide-react';

// 1. 관리자 비밀번호
const ADMIN_PASSWORD = 'admin'; 

// 2. 웹하드 다운로드 링크 (실제 웹하드/클라우드 링크로 교체하세요)
const WEBHARD_DOWNLOAD_URL = 'https://drive.google.com'; 

// 이미지 기반 5대 카테고리 목록
const CATEGORIES = [
  '전체',
  '1. Hygiene Care – Inflammation Control',
  '2. Soft Tissue Cutting',
  '3. Soft & Hard Tissue – Definitive Treatment',
  '4. Esthetics',
  '5. Endodontics'
];

const INITIAL_PROTOCOLS = [
  {
    id: 'hygiene-care',
    title: 'Waterlase REPAIR Perio™ Protocol',
    category: '1. Hygiene Care – Inflammation Control',
    model: 'Waterlase iPlus',
    youtubeId: 'dQw4w9WgXcQ',
    tip: 'RFPT 5 / RFPT 8',
    power: '1.5W - 2.0W',
    hz: '30Hz - 50Hz',
    waterAir: 'Water 30% / Air 40%',
    summary: '치주낭 내부 살균 및 염증 제어(Inflammation Control)를 위한 최소 침습 레이저 프로토콜.',
    steps: [
      'Step 1: RFPT 팁을 이용해 치주낭 내 잔여 결합조직 및 육아조직 제거',
      'Step 2: 치근 활택술(Root Planing) 후 레이저로 스미어 레이어 및 세균막 제거',
      'Step 3: 응고 모드로 혈병(Blood Clot) 형성 유도'
    ]
  },
  {
    id: 'soft-tissue-cutting',
    title: 'Gingivectomy & Soft Tissue Excision',
    category: '2. Soft Tissue Cutting',
    model: 'Waterlase iPlus',
    youtubeId: 'dQw4w9WgXcQ',
    tip: 'MZ6 / Gold Handpiece',
    power: '1.5W - 2.5W',
    hz: '30Hz - 50Hz',
    waterAir: 'Water 10% / Air 20%',
    summary: '출혈 없이 정밀하게 연조직을 절제(Soft Tissue Cutting)하고 지혈하는 프로토콜.',
    steps: [
      'Step 1: 절제 라인 디자인 및 마킹',
      'Step 2: 접촉식 팁으로 부드러운 핸들링 절제',
      'Step 3: 주변 연조직 지혈 및 경계 정리'
    ]
  },
  {
    id: 'soft-hard-tissue',
    title: 'Crown Lengthening & Bone Recontouring',
    category: '3. Soft & Hard Tissue – Definitive Treatment',
    model: 'Waterlase iPlus',
    youtubeId: 'dQw4w9WgXcQ',
    tip: 'MZ6 / MZ8',
    power: '3.5W - 4.5W',
    hz: '15Hz - 20Hz',
    waterAir: 'Water 60% / Air 70%',
    summary: '연조직 절제 및 치조골 삭제를 동시/순차적으로 진행하는 확정적 치료 프로토콜.',
    steps: [
      'Step 1: 연조직 절제 및 생물학적 폭경 확보 라인 형성',
      'Step 2: 충분한 수분 주주 하에 치조골 무열 손상 삭제',
      'Step 3: 변연부 평탄화 및 최종 세척'
    ]
  },
  {
    id: 'esthetics-protocol',
    title: 'Melanin Depigmentation & Smile Design',
    category: '4. Esthetics',
    model: 'Waterlase Express',
    youtubeId: 'dQw4w9WgXcQ',
    tip: 'MZ6 / RFPT',
    power: '1.0W - 1.5W',
    hz: '30Hz',
    waterAir: 'Water 20% / Air 30%',
    summary: '치은 멜라닌 색소 제거 및 심미적 치은 성형을 위한 에스테틱 프로토콜.',
    steps: [
      'Step 1: 표층 상피 멜라닌 층 균일 레이저 박리',
      'Step 2: 냉각 수분 조절을 통한 열손상 방지',
      'Step 3: 비침습 치유 유도'
    ]
  },
  {
    id: 'endodontics-protocol',
    title: 'REPAIR Endo™ Root Canal Disinfection',
    category: '5. Endodontics',
    model: 'Waterlase iPlus',
    youtubeId: 'dQw4w9WgXcQ',
    tip: 'RFT2 / RFT3',
    power: '1.25W',
    hz: '50Hz',
    waterAir: 'Water 20% / Air 30%',
    summary: '근관 내 세균막 살균 및 스미어 레이어 제거를 위한 워터레이즈 근관 치료 프로토콜.',
    steps: [
      'Step 1: 통상적인 근관 확대 형성 후 RFT 팁을 근단부 1mm 직전까지 위치',
      'Step 2: 나선형으로 천천히 회전하며 인출 (초당 약 1mm)',
      'Step 3: 최종 세척 및 건조 후 근관 충전 준비'
    ]
  }
];

export default function App() {
  const [protocols, setProtocols] = useState(() => {
    const saved = localStorage.getItem('waterlase_protocols_v2');
    return saved ? JSON.parse(saved) : INITIAL_PROTOCOLS;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('is_waterlase_admin') === 'true';
  });

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const [newForm, setNewForm] = useState({
    title: '',
    category: CATEGORIES[1],
    model: 'Waterlase iPlus',
    youtubeUrl: '',
    tip: '',
    power: '',
    hz: '',
    waterAir: '',
    summary: ''
  });

  useEffect(() => {
    localStorage.setItem('waterlase_protocols_v2', JSON.stringify(protocols));
  }, [protocols]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem('is_waterlase_admin', 'true');
      setIsLoginModalOpen(false);
      setPasswordInput('');
      alert('관리자 모드로 전환되었습니다.');
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('is_waterlase_admin');
    alert('관리자 모드에서 로그아웃되었습니다.');
  };

  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (!isAdmin) {
      alert('관리자만 삭제할 수 있습니다.');
      return;
    }
    if (window.confirm('이 프로토콜 영상을 삭제하시겠습니까?')) {
      const updated = protocols.filter(item => item.id !== id);
      setProtocols(updated);
      if (activeVideo && activeVideo.id === id) {
        setActiveVideo(null);
      }
    }
  };

  const handleAddProtocol = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('관리자 권한이 필요합니다.');
      return;
    }
    if (!newForm.title || !newForm.youtubeUrl) {
      alert('제목과 유튜브 링크를 입력해주세요.');
      return;
    }
    const ytId = extractYoutubeId(newForm.youtubeUrl);
    const newEntry = {
      id: 'proto-' + Date.now(),
      title: newForm.title,
      category: newForm.category,
      model: newForm.model,
      youtubeId: ytId,
      tip: newForm.tip || 'MZ6 / RFPT',
      power: newForm.power || '1.5W',
      hz: newForm.hz || '30Hz',
      waterAir: newForm.waterAir || 'Water 30% / Air 30%',
      summary: newForm.summary || '임상 프로토콜 세팅 가이드',
      steps: ['시술 부위 준비 및 소독', '지정 파라미터 세팅 후 시술 적용', '치유 확인 및 마무리']
    };
    setProtocols([newEntry, ...protocols]);
    setIsAddModalOpen(false);
    setNewForm({
      title: '',
      category: CATEGORIES[1],
      model: 'Waterlase iPlus',
      youtubeUrl: '',
      tip: '',
      power: '',
      hz: '',
      waterAir: '',
      summary: ''
    });
  };

  const handleCopyParams = (item, e) => {
    e.stopPropagation();
    const text = `[${item.title}]\nTip: ${item.tip}\nPower: ${item.power} | Hz: ${item.hz}\nWater/Air: ${item.waterAir}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProtocols = protocols.filter(item => {
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.tip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 헤더 */}
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 30, padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }}>
              <Activity size={24} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.02em' }}>Waterlase Clinical Hub</h1>
                {isAdmin && (
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#059669', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    관리자 모드
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>워터레이저 임상 프로토콜 아카이브</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="시술, 팁 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <a
              href={WEBHARD_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="웹하드 자료실로 이동"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#334155',
                color: '#38bdf8',
                border: '1px solid #0284c7',
                padding: '9px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              <FolderDown size={16} /> 자료실 다운로드
            </a>

            {isAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <Plus size={16} /> 프로토콜 추가
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={handleAdminLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#334155',
                  color: '#f87171',
                  border: '1px solid #475569',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <LogOut size={15} /> 로그아웃
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                <Lock size={15} /> 관리자
              </button>
            )}
          </div>
        </div>

     {/* 카테고리 탭 (2줄 그리드 레이아웃) */}
        <div 
          style={{ 
            maxWidth: '1200px', 
            margin: '14px auto 0', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '8px' 
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                border: selectedCategory === cat ? '1px solid #38bdf8' : '1px solid #334155',
                backgroundColor: selectedCategory === cat ? '#0369a1' : '#1e293b',
                color: selectedCategory === cat ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat ? 600 : 400,
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* 메인 리스트 */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {filteredProtocols.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem' }}>해당 카테고리의 프로토콜 영상이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
            {filteredProtocols.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveVideo(item)}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000' }}>
                  <img
                    src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    alt={item.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(2, 132, 199, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={22} color="#fff" fill="#fff" />
                    </div>
                  </div>
                  <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                    {item.category}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      title="프로토콜 삭제"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', lineHeight: '1.4', fontWeight: 600 }}>{item.title}</h3>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>{item.summary}</p>
                  </div>

                  <div style={{ backgroundColor: '#0f172a', padding: '10px 12px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>Tip: {item.tip}</span>
                      <span style={{ color: '#cbd5e1' }}>{item.power} / {item.hz}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8' }}>{item.waterAir}</span>
                      <button
                        onClick={(e) => handleCopyParams(item, e)}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem' }}
                      >
                        {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === item.id ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 모달: 영상 재생 */}
      {activeVideo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #334155' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{activeVideo.title}</h2>
              <button onClick={() => setActiveVideo(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#38bdf8' }}>권장 파라미터 세팅</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem' }}>
                Tip: <b>{activeVideo.tip}</b> | Power: <b>{activeVideo.power}</b> | Rep Rate: <b>{activeVideo.hz}</b> | Spray: <b>{activeVideo.waterAir}</b>
              </p>

              {activeVideo.steps && (
                <>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#38bdf8' }}>임상 절차 가이드 (Steps)</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    {activeVideo.steps.map((st, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{st}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 모달: 관리자 로그인 */}
      {isLoginModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleAdminLogin} style={{ backgroundColor: '#1e293b', borderRadius: '12px', width: '100%', maxWidth: '360px', padding: '24px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>관리자 인증</h3>
              </div>
              <button type="button" onClick={() => setIsLoginModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 16px 0' }}>비밀번호를 입력해 주세요.</p>
            <input
              type="password"
              placeholder="관리자 비밀번호"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box', marginBottom: '14px', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
            >
              인증 확인
            </button>
          </form>
        </div>
      )}

      {/* 모달: 영상 추가 */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleAddProtocol} style={{ backgroundColor: '#1e293b', borderRadius: '12px', width: '100%', maxWidth: '480px', padding: '24px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>새 프로토콜 영상 추가</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>프로토콜 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="시술명 입력"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>유튜브 URL 또는 영상 ID *</label>
                <input
                  type="text"
                  required
                  placeholder="https://youtu.be/... 또는 영상 ID"
                  value={newForm.youtubeUrl}
                  onChange={(e) => setNewForm({ ...newForm, youtubeUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>카테고리 선택</label>
                <select
                  value={newForm.category}
                  onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                >
                  {CATEGORIES.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>적용 Tip</label>
                  <input
                    type="text"
                    placeholder="MZ6, RFPT 5"
                    value={newForm.tip}
                    onChange={(e) => setNewForm({ ...newForm, tip: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>Power / Hz</label>
                  <input
                    type="text"
                    placeholder="1.5W / 30Hz"
                    value={newForm.power}
                    onChange={(e) => setNewForm({ ...newForm, power: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>Water / Air</label>
                <input
                  type="text"
                  placeholder="Water 30% / Air 40%"
                  value={newForm.waterAir}
                  onChange={(e) => setNewForm({ ...newForm, waterAir: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', color: '#cbd5e1' }}>요약 설명</label>
                <textarea
                  rows={2}
                  placeholder="시술 목적 및 주의사항 간략 메모"
                  value={newForm.summary}
                  onChange={(e) => setNewForm({ ...newForm, summary: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                style={{ marginTop: '10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}