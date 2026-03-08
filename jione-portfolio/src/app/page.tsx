const groups = [
  {
    style: 'Block',
    description: '카드 기반 섹션 구성 — Hero → About → Projects → Contact',
    tones: [
      { label: 'Toss', path: '/block/toss', primary: '#3182F6', fg: '#ffffff' },
      { label: 'Kakao', path: '/block/kakao', primary: '#FEE500', fg: '#1A1A1A' },
    ],
  },
  {
    style: 'Corporate',
    description: 'GNB + 대형 Hero + 카드 슬라이더 구성 — 기업 사이트 스타일',
    tones: [
      { label: 'Toss', path: '/corporate/toss', primary: '#3182F6', fg: '#ffffff' },
      { label: 'Kakao', path: '/corporate/kakao', primary: '#FEE500', fg: '#1A1A1A' },
    ],
  },
];

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', fontFamily: 'Pretendard Variable, sans-serif', background: '#f8f9fa', padding: '3rem 2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>포트폴리오 스타일 선택</h1>
      <p style={{ color: '#888' }}>원하는 Style × Tone 조합을 선택하세요.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '640px', width: '100%' }}>
        {groups.map((g) => (
          <div key={g.style} style={{ background: '#ffffff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Style</p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.375rem' }}>{g.style}</h2>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1.25rem' }}>{g.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {g.tones.map((t) => (
                <a key={t.path} href={t.path} style={{ padding: '0.75rem 0', background: t.primary, color: t.fg, borderRadius: '10px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'block' }}>
                  {t.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
