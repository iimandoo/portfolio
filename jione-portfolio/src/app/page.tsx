export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'Pretendard Variable, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
        포트폴리오 테마 선택
      </h1>
      <p style={{ color: '#888', marginBottom: '1rem' }}>
        아래 테마 중 하나를 선택하여 포트폴리오를 확인하세요.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="/toss"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3182F6',
            color: '#fff',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Toss 스타일
        </a>
        <a
          href="/minimal"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#000',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Minimal 스타일
        </a>
        <a
          href="/dark"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#7C3AED',
            color: '#fff',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Dark 스타일
        </a>
        <a
          href="/kakao"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#FEE500',
            color: '#1A1A1A',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Kakao 스타일
        </a>
        <a
          href="/naver"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#03C75A',
            color: '#fff',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Naver 스타일
        </a>
      </div>
      <p style={{ color: '#aaa', fontSize: '0.875rem', marginTop: '1rem' }}>
        /toss-theme-on, /theme-minimal, /theme-dark, /theme-kakao, /theme-naver 명령어를 실행하여 각
        테마를 활성화하세요.
      </p>
    </main>
  );
}
