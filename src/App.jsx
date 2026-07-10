import './index.css';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="var(--success-light)" />
    <path d="M6 10l3 3 5-6" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="var(--primary-soft)" />
    <path d="M16 8l6 3v5c0 4-3 7-6 8-3-1-6-4-6-8v-5l6-3z" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16l3 3 5-6" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="var(--primary-soft)" />
    <rect x="8" y="14" width="4" height="10" rx="1" fill="var(--primary)" />
    <rect x="14" y="10" width="4" height="14" rx="1" fill="var(--primary)" opacity="0.7" />
    <rect x="20" y="6" width="4" height="18" rx="1" fill="var(--primary)" opacity="0.5" />
  </svg>
);

const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="var(--primary-soft)" />
    <circle cx="12" cy="11" r="4" stroke="var(--primary)" strokeWidth="2" />
    <path d="M4 24c0-4 3.5-7 8-7s8 3 8 7" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="12" r="3" stroke="var(--primary)" strokeWidth="2" />
    <path d="M26 24c0-2.5-1.5-4.5-4-5.5" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloudIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="var(--primary-soft)" />
    <path d="M8 20a4 4 0 01-.5-7.9A6 6 0 0116 10c2.5 0 4.5 1.5 5.5 3.5A4.5 4.5 0 0116 16h-1a3 3 0 100 6h6" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="var(--primary-soft)" />
    <rect x="9" y="14" width="14" height="11" rx="2" stroke="var(--primary)" strokeWidth="2" />
    <path d="M11 14v-4a5 5 0 0110 0v4" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="19" r="1.5" fill="var(--primary)" />
  </svg>
);

const features = [
  {
    icon: <ShieldIcon />,
    title: "Aman & Terpercaya",
    description: "Data keuangan cooperatives dienkripsi dengan standar keamanan tinggi.离线-first PWA memastikan data Anda selalu aman."
  },
  {
    icon: <ChartIcon />,
    title: "Analisis Real-time",
    description: "Visualisasi data keuangan cooperativas secara real-time. Grafik interaktif untuk pengambilan keputusan yang lebih baik."
  },
  {
    icon: <UsersIcon />,
    title: "Multi-Pengguna",
    description: "Kelola anggota cooperatives dengan mudah. Sistem role dan permissions untuk kontrol akses yang fleksibel."
  },
  {
    icon: <CloudIcon />,
    title: "Offline-First",
    description: "Berkerja tanpa internet. Sinkronisasi otomatis ketika koneksi tersedia. Tidak ada lagi担心的 konektivitas."
  },
  {
    icon: <LockIcon />,
    title: "Compliant",
    description: "Memenuhi standar regulasi pemerintah. Laporan keuangan otomatis sesuai format yang berlaku."
  },
  {
    icon: <ChartIcon />,
    title: "Inventory Terintegrasi",
    description: "Kelola inventaris cooperatives dalam satu platform. Tracking stock, mutasi, dan nilai asset dengan mudah."
  }
];

const benefits = [
  "Mengurangi waktu pengelolaan keuangan hingga 70%",
  "Laporan keuangan akurat dalam hitungan detik",
  "Akses data kapan saja, di mana saja",
  "Kolaborasi tim yang lebih efektif",
  "Reducsi kesalahan manusia dalam perhitungan"
];

function App() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 1000,
        height: '72px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '18px'
            }}>
              S
            </div>
            <span style={{ fontWeight: '700', fontSize: '20px', color: 'var(--text-primary)' }}>SIKOPET</span>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="nav-links">
            <button onClick={() => scrollToSection('fitur')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px' }}>Fitur</button>
            <button onClick={() => scrollToSection('manfaat')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px' }}>Manfaat</button>
            <button onClick={() => scrollToSection('kontak')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>Mulai Sekarang</button>
          </div>
        </div>
      </nav>

      <section id="hero" style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        backgroundColor: 'var(--bg)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'var(--primary-light)',
            borderRadius: 'var(--radius-badge)',
            marginBottom: '24px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
            <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600' }}>Offline-First PWA</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '24px',
            lineHeight: '1.2',
            maxWidth: '800px',
            margin: '0 auto 24px'
          }}>
            Kelola Keuangan Cooperative
            <span style={{ color: 'var(--primary)' }}> Dengan Lebih Mudah</span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.7'
          }}>
            Sistem informasi manajemen keuangan terintegrasi untuk cooperatives Indonesia. 
            Modern, aman, dan dapat diakses offline.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
              Coba Gratis
            </button>
            <button className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
              Lihat Demo
            </button>
          </div>

          <div style={{
            marginTop: '80px',
            padding: '24px',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-card)',
            maxWidth: '900px',
            margin: '80px auto 0'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '32px',
              textAlign: 'left'
            }}>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)' }}>1,250+</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Cooperatives Terdaftar</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)' }}>50,000+</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Transaksi per Hari</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)' }}>99.9%</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Uptime</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)' }}>4.9/5</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Rating Pengguna</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" style={{
        padding: '100px 0',
        backgroundColor: 'var(--surface-secondary)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="section-title">Fitur Unggulan</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Semua yang Anda butuhkan untuk mengelola keuangan cooperatives dalam satu platform yang intuitif
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, index) => (
              <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="manfaat" style={{
        padding: '100px 0',
        backgroundColor: 'var(--bg)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}>
            <div>
              <h2 className="section-title">Kenapa Memilih SIKOPET?</h2>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.7' }}>
                Dirancang khusus untuk memenuhi kebutuhan cooperativas di Indonesia dengan fitur yang relevan dan mudah digunakan.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {benefits.map((benefit, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckIcon />
                    <span style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-card)',
              padding: '32px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Penghematan Waktu</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--success)' }}>70%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--success)', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Akurasi Data</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>99%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '99%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Kepuasan Pengguna</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--warning)' }}>95%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '95%', height: '100%', backgroundColor: 'var(--warning)', borderRadius: '4px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Efisiensi Biaya</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--info)' }}>60%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--info)', borderRadius: '4px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kontak" style={{
        padding: '100px 0',
        backgroundColor: 'var(--primary)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '700',
            color: 'white',
            marginBottom: '24px'
          }}>
            Siap Mengelola Cooperative Anda Lebih Baik?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '500px',
            margin: '0 auto 40px'
          }}>
            Bergabung dengan ratusan cooperatives yang sudah menggunakan SIKOPET untuk mengelola keuangan mereka.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: 'white',
              color: 'var(--primary)',
              fontWeight: '600'
            }}>
              Mulai Uji Coba Gratis
            </button>
            <button className="btn" style={{
              padding: '14px 32px',
              fontSize: '16px',
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              fontWeight: '600'
            }}>
              Hubungi Sales
            </button>
          </div>
        </div>
      </section>

      <footer style={{
        padding: '48px 0',
        backgroundColor: 'var(--text-primary)',
        color: 'white'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '18px'
                }}>
                  S
                </div>
                <span style={{ fontWeight: '700', fontSize: '20px' }}>SIKOPET</span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.7' }}>
                Sistem Informasi Manajemen Keuangan Cooperativa Terintegrasi.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>Produk</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#fitur" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Fitur</a>
                <a href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Harga</a>
                <a href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Dokumentasi</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>Perusahaan</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Tentang Kami</a>
                <a href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Blog</a>
                <a href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Karir</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>Kontak</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>info@sikopet.id</span>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>+62 21 1234 5678</span>
              </div>
            </div>
          </div>
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2026 SIKOPET. Hak cipta dilindungi.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>Kebijakan Privasi</a>
              <a href="#" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
