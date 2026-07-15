import { useMemo, useRef, useState } from 'react';

const STAFF = [
  { id: '1', name: 'Budi Santoso', role: 'Kaur Keuangan', initials: 'BS', status: 'hadir', time: '07:45' },
  { id: '2', name: 'Siti Aminah', role: 'Sekretaris Desa', initials: 'SA', status: 'dinas', time: '08:02' },
  { id: '3', name: 'Agus Pratama', role: 'Kasi Pelayanan', initials: 'AP', status: 'hadir', time: '08:15' },
  { id: '4', name: 'Rini Kusuma', role: 'Kasi Kesejahteraan', initials: 'RK', status: 'alfa', time: '--:--' },
  { id: '5', name: 'Dewi Lestari', role: 'Kaur Umum', initials: 'DL', status: 'hadir', time: '07:50' },
  { id: '6', name: 'Eko Prasetyo', role: 'Kadun I', initials: 'EP', status: 'hadir', time: '07:55' },
  { id: '7', name: 'Jaka Samudra', role: 'Kadun II', initials: 'JS', status: 'izin', time: '--:--' },
  { id: '8', name: 'Maya Sari', role: 'Kaur Kesra', initials: 'MS', status: 'hadir', time: '08:05' },
  { id: '9', name: 'Irwan Saputra', role: 'Sekdes', initials: 'IS', status: 'hadir', time: '07:40' },
  { id: '10', name: 'Nur Hidayah', role: 'Kaur Pembangunan', initials: 'NH', status: 'hadir', time: '08:10' },
  { id: '11', name: 'Anto Wijaya', role: 'Kaur Keuangan', initials: 'AW', status: 'hadir', time: '08:20' },
];

const ACTIVITY_LOG = [
  { id: 'a1', name: 'Budi Santoso', role: 'Kaur Keuangan', time: '07:45 WIB', type: 'MASUK', icon: 'login', iconClass: 'bg-primary-fixed text-primary' },
  { id: 'a2', name: 'Siti Aminah', role: 'Sekretaris Desa', time: '08:02 WIB', type: 'DINAS LUAR', icon: 'work', iconClass: 'bg-surface-dim text-on-surface-variant' },
  { id: 'a3', name: 'Agus Pratama', role: 'Kasi Pelayanan', time: '08:15 WIB', type: 'MASUK', icon: 'login', iconClass: 'bg-primary-fixed text-primary' },
  { id: 'a4', name: 'Irwan Saputra', role: 'Sekdes', time: '07:40 WIB', type: 'MASUK', icon: 'login', iconClass: 'bg-primary-fixed text-primary' },
  { id: 'a5', name: 'Jaka Samudra', role: 'Kadun II', time: '08:30 WIB', type: 'IZIN', icon: 'event_busy', iconClass: 'bg-surface-variant text-on-tertiary-fixed-variant' },
];

const MONTHLY = [
  { name: 'Budi Santoso', h: 18, i: 1, dl: 2, a: 0 },
  { name: 'Siti Aminah', h: 20, i: 0, dl: 1, a: 0 },
  { name: 'Agus Pratama', h: 15, i: 2, dl: 0, a: 4 },
  { name: 'Irwan Saputra', h: 21, i: 0, dl: 1, a: 0 },
  { name: 'Dewi Lestari', h: 19, i: 1, dl: 1, a: 0 },
];

const STATUS_BADGE = {
  hadir: { label: 'HADIR', class: 'bg-primary-fixed text-on-primary-fixed-variant', timeClass: 'text-primary', icon: 'check_circle', iconClass: 'text-primary' },
  dinas: { label: 'DINAS', class: 'bg-secondary-fixed text-on-secondary-fixed-variant', timeClass: 'text-secondary', icon: 'business_center', iconClass: 'text-secondary' },
  izin: { label: 'IZIN', class: 'bg-surface-variant text-on-tertiary-fixed-variant', timeClass: 'text-on-tertiary-fixed-variant', icon: 'event_busy', iconClass: 'text-on-tertiary-fixed-variant' },
  alfa: { label: 'ALFA', class: 'bg-error-container text-on-error-container', timeClass: 'text-error', icon: 'cancel', iconClass: 'text-error' },
};

const NOTIFICATIONS = [
  { icon: 'event_available', title: 'Apel Pagi', text: 'Apel pagi hari ini pukul 07:30 WIB di halaman kantor desa.' },
  { icon: 'warning', title: 'Alfa Terdeteksi', text: 'Rini Kusuma belum melakukan presensi masuk hari ini.' },
  { icon: 'description', title: 'Laporan Bulanan', text: 'Laporan kehadiran Mei 2024 telah siap diunduh.' },
];

export default function Monitoring({ onLogout }) {
  const [modal, setModal] = useState(null); // 'notif' | 'activity'
  const [navActive, setNavActive] = useState('monitoring');
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const monthlyRef = useRef(null);

  const total = STAFF.length;
  const hadir = STAFF.filter((s) => s.status === 'hadir').length;
  const dinas = STAFF.filter((s) => s.status === 'dinas').length;
  const izin = STAFF.filter((s) => s.status === 'izin').length;
  const alfa = STAFF.filter((s) => s.status === 'alfa').length;
  const presentPct = total ? Math.round((hadir / total) * 100) : 0;

  const filteredDaily = useMemo(() => {
    const q = query.toLowerCase().trim();
    return STAFF.filter((s) => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
      const matchS = statusFilter === 'all' || s.status === statusFilter;
      return matchQ && matchS;
    });
  }, [query, statusFilter]);

  const handleNav = (id) => {
    setNavActive(id);
    if (id === 'laporan') {
      monthlyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const downloadCsv = () => {
    const header = 'Nama Staff,Hadir,Izin,Dinas Luar,Alfa\n';
    const rows = MONTHLY.map((m) => `${m.name},${m.h},${m.i},${m.dl},${m.a}`).join('\n');
    const csv = `${header}${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan-kehadiran-mei.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-on-surface pb-24 bg-background">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-gutter py-base">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-primary-container flex items-center justify-center text-on-primary font-bold">
            KD
          </div>
          <div className="flex flex-col">
            <span className="font-title-md text-title-md text-primary leading-tight">Sistem Presensi Desa</span>
            <span className="text-[10px] font-label-caps text-secondary uppercase tracking-widest">Panel Monitoring Kades</span>
          </div>
        </div>
        <button onClick={() => setModal('notif')} className="relative material-symbols-outlined text-primary p-2 hover:bg-surface-container-high transition-colors active:opacity-80 rounded-full" aria-label="Notifikasi">
          notifications
          {alfa > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />}
        </button>
      </header>

      <main className="px-gutter pt-gutter space-y-6">
        {/* Attendance Summary */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-title-md text-primary">Ringkasan Kehadiran</h2>
            <span className="text-body-sm text-secondary">Hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-6 bg-primary-container text-on-primary-container p-5 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-label-caps uppercase opacity-80 mb-1">Total Kehadiran</p>
                <h3 className="text-[32px] font-bold">{presentPct}%</h3>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-on-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">leaderboard</span>
              </div>
            </div>
            <div className="col-span-3 bg-surface-container-high p-4 rounded-xl border border-outline-variant flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">check_circle</span>
              <span className="text-[20px] font-bold text-primary">{hadir}</span>
              <span className="text-label-caps text-on-surface-variant">Hadir</span>
            </div>
            <div className="col-span-3 bg-surface-container-high p-4 rounded-xl border border-outline-variant flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-secondary text-3xl mb-2">business_center</span>
              <span className="text-[20px] font-bold text-secondary">{dinas}</span>
              <span className="text-label-caps text-on-surface-variant">Dinas Luar</span>
            </div>
            <div className="col-span-3 bg-surface-container-high p-4 rounded-xl border border-outline-variant flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-on-tertiary-fixed-variant text-3xl mb-2">event_busy</span>
              <span className="text-[20px] font-bold text-on-tertiary-fixed-variant">{izin}</span>
              <span className="text-label-caps text-on-surface-variant">Izin</span>
            </div>
            <div className="col-span-3 bg-error-container p-4 rounded-xl border border-error/10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-error text-3xl mb-2">cancel</span>
              <span className="text-[20px] font-bold text-error">{alfa}</span>
              <span className="text-label-caps text-on-error-container">Alfa</span>
            </div>
          </div>
        </section>

        {/* Live Monitoring Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-title-md text-primary">Aktivitas Terbaru</h2>
            <button onClick={() => setModal('activity')} className="text-body-sm text-primary font-semibold flex items-center">Lihat Semua <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span></button>
          </div>
          <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
              {ACTIVITY_LOG.slice(0, 3).map((a, i) => (
                <div key={a.id} className={`flex items-start gap-4 p-4 hover:bg-surface-container transition-colors ${i < ACTIVITY_LOG.slice(0, 3).length - 1 ? 'border-b border-outline-variant/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${a.iconClass}`}>
                    <span className="material-symbols-outlined">{a.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-body-lg text-on-surface">{a.name}</h4>
                      <span className="text-[11px] font-medium text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">{a.time}</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">{a.role} • <span className="text-primary font-medium">{a.type}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Recapitulation */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-title-md text-primary">Rekap Harian</h2>
            <div className="flex gap-2">
              <button onClick={() => { setShowFilter((v) => !v); setShowSearch(false); }} className={`p-2 rounded-lg ${showFilter ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`} aria-label="Filter">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button onClick={() => { setShowSearch((v) => !v); setShowFilter(false); }} className={`p-2 rounded-lg ${showSearch ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`} aria-label="Cari">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>
          {showSearch && (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau jabatan..."
              className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          )}
          {showFilter && (
            <div className="flex flex-wrap gap-2">
              {['all', 'hadir', 'dinas', 'izin', 'alfa'].map((f) => (
                <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusFilter === f ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  {f === 'all' ? 'Semua' : STATUS_BADGE[f].label}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-3">
            {filteredDaily.map((s) => {
              const b = STATUS_BADGE[s.status];
              return (
                <div key={s.id} className={`bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between ${s.status === 'alfa' ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold">{s.initials}</div>
                    <div>
                      <h4 className="font-semibold text-on-surface">{s.name}</h4>
                      <p className="text-[12px] text-on-surface-variant">{s.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[12px] font-bold mb-1 ${b.timeClass}`}>{s.time}</div>
                    <span className={`${b.class} text-[10px] font-bold px-2 py-1 rounded-md`}>{b.label}</span>
                  </div>
                </div>
              );
            })}
            {filteredDaily.length === 0 && (
              <p className="text-center text-body-sm text-on-surface-variant py-6">Tidak ada perangkat yang cocok dengan filter.</p>
            )}
          </div>
        </section>

        {/* Monthly Recapitulation */}
        <section className="space-y-4 pb-8" ref={monthlyRef}>
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-title-md text-primary">Laporan Bulanan ({new Date().toLocaleDateString('id-ID', { month: 'long' })})</h2>
            <button onClick={downloadCsv} className="material-symbols-outlined text-primary" aria-label="Unduh laporan">file_download</button>
          </div>
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="px-4 py-3 text-label-caps text-on-surface-variant">Nama Staff</th>
                    <th className="px-2 py-3 text-label-caps text-on-surface-variant text-center">H</th>
                    <th className="px-2 py-3 text-label-caps text-on-surface-variant text-center">I</th>
                    <th className="px-2 py-3 text-label-caps text-on-surface-variant text-center">DL</th>
                    <th className="px-2 py-3 text-label-caps text-on-surface-variant text-center">A</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {MONTHLY.map((m) => (
                    <tr key={m.name}>
                      <td className="px-4 py-3 text-body-sm font-semibold">{m.name}</td>
                      <td className="px-2 py-3 text-body-sm text-center">{m.h}</td>
                      <td className="px-2 py-3 text-body-sm text-center">{m.i}</td>
                      <td className="px-2 py-3 text-body-sm text-center">{m.dl}</td>
                      <td className="px-2 py-3 text-body-sm text-center text-error font-bold">{m.a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-surface text-center">
              <p className="text-[11px] text-secondary">Ket: H(Hadir), I(Izin), DL(Dinas Luar), A(Alfa)</p>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] bg-surface rounded-t-xl">
        <button onClick={() => handleNav('beranda')} className="flex flex-col items-center justify-center text-secondary p-2 hover:bg-secondary-container/50 active:scale-95 transition-transform duration-200">
          <span className="material-symbols-outlined mb-1">dashboard</span>
          <span className="font-label-caps text-label-caps uppercase">Beranda</span>
        </button>
        <button onClick={() => handleNav('monitoring')} className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 active:scale-95 transition-transform duration-200 ${navActive === 'monitoring' ? 'bg-primary-container text-on-primary-container' : 'text-secondary hover:bg-secondary-container/50'}`}>
          <span className="material-symbols-outlined mb-1" style={navActive === 'monitoring' ? { fontVariationSettings: '"FILL" 1' } : undefined}>visibility</span>
          <span className="font-label-caps text-label-caps uppercase">Monitoring</span>
        </button>
        <button onClick={() => handleNav('laporan')} className="flex flex-col items-center justify-center text-secondary p-2 hover:bg-secondary-container/50 active:scale-95 transition-transform duration-200">
          <span className="material-symbols-outlined mb-1">analytics</span>
          <span className="font-label-caps text-label-caps uppercase">Laporan</span>
        </button>
      </nav>

      {/* Modal: Notifikasi */}
      {modal === 'notif' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Notifikasi</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="space-y-2">
              {NOTIFICATIONS.map((n) => (
                <div key={n.title} className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                  <span className="material-symbols-outlined text-primary text-[20px]">{n.icon}</span>
                  <div>
                    <p className="text-body-sm text-on-surface font-semibold">{n.title}</p>
                    <p className="text-body-sm text-on-surface-variant">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {onLogout && (
              <button onClick={onLogout} className="mt-4 w-full flex items-center justify-center gap-2 h-11 rounded-lg border border-error text-error font-bold hover:bg-error-container/20 transition-colors">
                <span className="material-symbols-outlined text-[20px]">logout</span> Keluar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: All Activity */}
      {modal === 'activity' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Semua Aktivitas</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <div className="space-y-1">
              {ACTIVITY_LOG.map((a, i) => (
                <div key={a.id} className={`flex items-start gap-4 p-3 hover:bg-surface-container transition-colors ${i < ACTIVITY_LOG.length - 1 ? 'border-b border-outline-variant/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${a.iconClass}`}>
                    <span className="material-symbols-outlined">{a.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-body-lg text-on-surface">{a.name}</h4>
                      <span className="text-[11px] font-medium text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">{a.time}</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">{a.role} • <span className="text-primary font-medium">{a.type}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
