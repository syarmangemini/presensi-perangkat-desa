import { useState } from 'react';
import { loadRecords } from '../storage';

const PROFILE_DEFAULT = {
  name: 'Budi Santoso',
  role: 'Kaur Keuangan',
  nipd: '19870512001',
  email: 'budi.santoso@desa.go.id',
  phone: '+62 812-3456-7890',
  address: 'Jl. Melati No. 45, Desa Suka Maju, Kec. Makmur',
  status: 'STAF AKTIF',
};

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function fmtMinutes(total) {
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function buildCalendar(records) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const byDate = {};
  records.forEach((r) => {
    if (!r.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) return;
    if (!byDate[r.date]) byDate[r.date] = {};
    if (r.type === 'masuk') byDate[r.date].masuk = r.time;
    if (r.type === 'izin') byDate[r.date].izin = r.keterangan || r.jenis || 'Izin';
  });

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const info = byDate[key];
    let kind = 'empty';
    if (info?.masuk) kind = 'masuk';
    else if (info?.izin) kind = 'izin';
    else if (d < today) kind = 'absent';
    cells.push({ day: d, key, kind, info });
  }
  return { cells, today, daysInMonth };
}

export default function Profile({ onNavigate, onLogout }) {
  const [profile, setProfile] = useState(PROFILE_DEFAULT);
  const [modal, setModal] = useState(null); // 'edit' | 'security' | 'help' | 'detail'
  const [editForm, setEditForm] = useState(profile);
  const [pwForm, setPwForm] = useState({ oldPw: '', newPw: '', confirmPw: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [toast, setToast] = useState('');

  const records = loadRecords();
  const { cells, today, daysInMonth } = buildCalendar(records);

  const monthName = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const hadirThisMonth = cells.filter((c) => c.kind === 'masuk').length;
  const masukTimes = records.filter((r) => r.type === 'masuk').map((r) => toMinutes(r.time.split(' ')[0]));
  const avgJam = masukTimes.length ? fmtMinutes(masukTimes.reduce((a, b) => a + b, 0) / masukTimes.length) : '--:--';

  const showToast = (msg) => setToast(msg);

  const openEdit = () => {
    setEditForm(profile);
    setModal('edit');
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setModal(null);
    showToast('Informasi profil diperbarui');
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (!pwForm.oldPw || !pwForm.newPw) {
      setPwMsg('Mohon isi semua kolom kata sandi.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirmPw) {
      setPwMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setPwMsg('Kata sandi berhasil diperbarui.');
    setTimeout(() => {
      setModal(null);
      setPwMsg('');
      setPwForm({ oldPw: '', newPw: '', confirmPw: '' });
    }, 1500);
  };

  const cellClass = (kind) => {
    switch (kind) {
      case 'masuk':
        return 'bg-green-100 text-green-800 font-bold';
      case 'izin':
        return 'bg-yellow-100 text-yellow-800 font-bold';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  const monthDetail = cells
    .filter((c) => c && c.kind !== 'empty')
    .map((c) => ({
      day: c.day,
      status: c.kind === 'masuk' ? 'Hadir' : c.kind === 'izin' ? 'Izin' : 'Tidak Hadir',
      time: c.info?.masuk || (c.info?.izin ? c.info.izin : '-'),
    }));

  const navItems = [
    { id: 'beranda', icon: 'home', label: 'Beranda' },
    { id: 'presensi', icon: 'fingerprint', label: 'Presensi' },
    { id: 'izin', icon: 'assignment', label: 'Izin' },
    { id: 'profil', icon: 'person', label: 'Profil', active: true },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background pb-24">
      {/* Top AppBar */}
      <header className="bg-surface shadow-sm flex items-center justify-between px-container-padding-mobile h-16 w-full sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance</span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Presensi Sistem</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline-variant flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">account_balance</span>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-container-padding-mobile md:px-container-padding-desktop mt-gutter space-y-gutter">
        {/* Profile Header Card */}
        <section className="relative overflow-hidden bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6">
          <div className="absolute top-0 right-0 w-full h-full batik-subtle pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-primary-container flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[64px]">person</span>
              </div>
              <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full shadow-md">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
              </div>
            </div>
            <div className="text-center md:text-left space-y-1">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">{profile.name}</h2>
              <p className="font-title-md text-title-md text-on-surface-variant">{profile.role}</p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mt-2">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-caps text-label-caps">NIPD: {profile.nipd}</span>
                <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full font-label-caps text-label-caps">{profile.status}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-card-gap">
          {/* Personal Info (Left) */}
          <div className="md:col-span-5 space-y-gutter">
            <div className="bg-white rounded-xl border border-outline-variant p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                <h3 className="font-title-md text-title-md text-primary">Informasi Pribadi</h3>
                <button onClick={openEdit} className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary" aria-label="Edit profil">edit</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">mail</span>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">EMAIL</p>
                    <p className="font-body-lg text-body-lg text-on-surface break-all">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">phone</span>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">TELEPON</p>
                    <p className="font-body-lg text-body-lg text-on-surface">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">ALAMAT</p>
                    <p className="font-body-lg text-body-lg text-on-surface">{profile.address}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-gutter">
              <div className="bg-surface-container-low rounded-xl border border-outline-variant p-4 text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">HADIR BULAN INI</p>
                <p className="font-headline-lg text-headline-lg text-primary">{hadirThisMonth}/{daysInMonth}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl border border-outline-variant p-4 text-center">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">RATA-RATA JAM</p>
                <p className="font-headline-lg text-headline-lg text-primary">{avgJam}</p>
              </div>
            </div>
          </div>

          {/* Attendance (Right) */}
          <div className="md:col-span-7 space-y-gutter">
            <div className="bg-white rounded-xl border border-outline-variant p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-title-md text-title-md text-primary">Kalender Kehadiran</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Performa kehadiran {monthName}</p>
                </div>
                <button onClick={() => setModal('detail')} className="flex items-center gap-2 text-primary font-title-md text-body-sm border border-primary px-4 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Lihat Detail
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 flex-grow">
                {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, i) => (
                  <div key={i} className="text-center font-label-caps text-on-surface-variant">{d}</div>
                ))}
                {cells.map((c, i) =>
                  c === null ? (
                    <div key={`e${i}`} className="aspect-square" />
                  ) : (
                    <div
                      key={c.key}
                      className={`aspect-square rounded-lg flex items-center justify-center text-body-sm relative group cursor-help ${cellClass(c.kind)} ${c.day === today ? 'ring-2 ring-primary' : ''}`}
                    >
                      {c.day}
                      {c.info?.masuk && (
                        <div className="hidden group-hover:block absolute bottom-full mb-2 bg-on-background text-white text-[10px] p-2 rounded whitespace-nowrap z-20">
                          Hadir - {c.info.masuk}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu List Section */}
        <section className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-title-md text-title-md text-primary">Akses Cepat &amp; Pengaturan</h3>
          </div>
          <div className="divide-y divide-outline-variant">
            <button onClick={openEdit} className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center"><span className="material-symbols-outlined text-primary">settings</span></div>
                <span className="font-body-lg text-body-lg text-on-surface">Pengaturan Akun</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button onClick={() => setModal('security')} className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center"><span className="material-symbols-outlined text-primary">security</span></div>
                <span className="font-body-lg text-body-lg text-on-surface">Keamanan &amp; Password</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button onClick={() => setModal('help')} className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center"><span className="material-symbols-outlined text-primary">help</span></div>
                <span className="font-body-lg text-body-lg text-on-surface">Pusat Bantuan</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button onClick={onLogout} className="w-full flex items-center justify-between p-5 hover:bg-error-container/20 transition-colors group text-left">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center"><span className="material-symbols-outlined text-error">logout</span></div>
                <span className="font-body-lg text-body-lg text-error font-semibold">Keluar</span>
              </div>
              <span className="material-symbols-outlined text-error group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        <div className="pt-8 pb-12 flex flex-col items-center justify-center opacity-40 grayscale pointer-events-none">
          <span className="material-symbols-outlined text-5xl mb-2">account_balance</span>
          <p className="font-label-caps text-label-caps">PEMERINTAH DESA SUKA MAJU</p>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-4 bg-surface border-t border-outline-variant safe-bottom">
        {navItems.map((t) => (
          <button
            key={t.id}
            onClick={() => (t.active ? undefined : onNavigate('dashboard'))}
            className={`flex flex-col items-center justify-center px-4 py-1 transition-all duration-150 ${t.active ? 'bg-secondary-container text-primary rounded-full scale-95' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined" style={t.active ? { fontVariationSettings: '"FILL" 1' } : undefined}>{t.icon}</span>
            <span className="font-label-caps text-label-caps mt-1">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-primary text-on-primary px-4 py-3 rounded-lg shadow-lg text-body-sm font-medium max-w-[90%] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toast}
        </div>
      )}

      {/* Modal: Edit Profil */}
      {modal === 'edit' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Pengaturan Akun</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <form onSubmit={saveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Nama Lengkap</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Jabatan</label>
                <input value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">NIPD</label>
                <input value={editForm.nipd} onChange={(e) => setEditForm({ ...editForm, nipd: e.target.value })} className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Email</label>
                <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Telepon</label>
                <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Alamat</label>
                <textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} rows={2} className="w-full p-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <button type="submit" className="w-full h-12 bg-primary text-on-primary rounded-lg font-title-md font-bold shadow-lg active:scale-[0.98] transition-all">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Keamanan & Password */}
      {modal === 'security' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Keamanan &amp; Password</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              <input type="password" value={pwForm.oldPw} onChange={(e) => setPwForm({ ...pwForm, oldPw: e.target.value })} placeholder="Kata sandi saat ini" className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              <input type="password" value={pwForm.newPw} onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })} placeholder="Kata sandi baru" className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              <input type="password" value={pwForm.confirmPw} onChange={(e) => setPwForm({ ...pwForm, confirmPw: e.target.value })} placeholder="Konfirmasi kata sandi baru" className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              <button type="submit" className="w-full h-12 bg-primary text-on-primary rounded-lg font-title-md font-bold shadow-lg active:scale-[0.98] transition-all">Perbarui Password</button>
            </form>
            {pwMsg && <p className="text-body-sm text-primary mt-3 text-center">{pwMsg}</p>}
          </div>
        </div>
      )}

      {/* Modal: Pusat Bantuan */}
      {modal === 'help' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Pusat Bantuan</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="space-y-3 text-body-sm text-on-surface-variant">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                <div><p className="font-semibold text-on-surface">Telepon</p><p>+62 812-3456-7890</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                <div><p className="font-semibold text-on-surface">Email</p><p>admin@desa.go.id</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
                <div><p className="font-semibold text-on-surface">WhatsApp</p><p>+62 812-3456-7890</p></div>
              </div>
            </div>
            <button onClick={() => setModal(null)} className="mt-5 w-full h-12 bg-primary text-on-primary rounded-lg font-title-md font-bold shadow-lg active:scale-[0.98] transition-all">Tutup</button>
          </div>
        </div>
      )}

      {/* Modal: Detail Kalender */}
      {modal === 'detail' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Detail Kehadiran</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <p className="text-body-sm text-on-surface-variant mb-3">{monthName} · {hadirThisMonth}/{daysInMonth} hari hadir</p>
            <div className="space-y-2">
              {monthDetail.map((d) => (
                <div key={d.day} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: d.status === 'Hadir' ? '#15803d' : d.status === 'Izin' ? '#a16207' : '#ba1a1a' }}>{d.status === 'Hadir' ? 'check_circle' : d.status === 'Izin' ? 'event_note' : 'cancel'}</span>
                    <p className="text-body-sm text-on-surface font-semibold">Tanggal {d.day}</p>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{d.time}</p>
                </div>
              ))}
              {monthDetail.length === 0 && (
                <p className="text-center text-body-sm text-on-surface-variant py-6">Belum ada catatan kehadiran bulan ini.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
