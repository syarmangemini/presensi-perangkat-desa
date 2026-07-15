import { useMemo, useState } from 'react';

const STAFF_SEED = [
  { id: '1', name: 'Irwan Saputra', role: 'Sekdes', nipd: '197501020001', initials: 'IS', color: 'bg-primary-fixed-dim text-primary', status: 'active', present: true },
  { id: '2', name: 'Dewi Lestari', role: 'Kaur Umum', nipd: '198203150002', initials: 'DL', color: 'bg-secondary-fixed text-secondary', status: 'active', present: true },
  { id: '3', name: 'Jaka Samudra', role: 'Kadun II', nipd: '198507200003', initials: 'JS', color: 'bg-surface-variant text-on-surface-variant', status: 'offline', present: false },
  { id: '4', name: 'Ahmad Alfian', role: 'Kaur Keuangan', nipd: '199010120004', initials: 'AA', color: 'bg-primary-fixed text-primary', status: 'active', present: true },
  { id: '5', name: 'Siti Maryam', role: 'Kaur Kesra', nipd: '199205180005', initials: 'SM', color: 'bg-tertiary-container text-white', status: 'active', present: true },
  { id: '6', name: 'Budi Santoso', role: 'Kaur Pembangunan', nipd: '198811030006', initials: 'BS', color: 'bg-secondary-fixed-dim text-on-secondary-container', status: 'active', present: true },
  { id: '7', name: 'Rina Wati', role: 'Kaur Pemerintahan', nipd: '199308220007', initials: 'RW', color: 'bg-primary-fixed-dim text-primary', status: 'active', present: true },
  { id: '8', name: 'Eko Prasetyo', role: 'Kadun I', nipd: '198409100008', initials: 'EP', color: 'bg-secondary-fixed text-secondary', status: 'active', present: true },
  { id: '9', name: 'Maya Sari', role: 'Kaur Umum', nipd: '199512010009', initials: 'MS', color: 'bg-surface-variant text-on-surface-variant', status: 'active', present: true },
  { id: '10', name: 'Anto Wijaya', role: 'Kaur Keuangan', nipd: '198702140010', initials: 'AW', color: 'bg-tertiary-container text-white', status: 'offline', present: false },
  { id: '11', name: 'Nur Hidayah', role: 'Kaur Kesra', nipd: '199109270011', initials: 'NH', color: 'bg-secondary-fixed-dim text-on-secondary-container', status: 'active', present: true },
];

const APPLICATIONS_SEED = [
  { id: 'a1', name: 'Ahmad Alfian', type: 'Sakit', date: '12-14 Okt 2023', urgent: true, status: 'pending' },
  { id: 'a2', name: 'Siti Maryam', type: 'Izin', date: '13 Okt 2023', urgent: false, status: 'pending' },
  { id: 'a3', name: 'Budi Santoso', type: 'Dinas Luar', date: '14 Okt 2023', urgent: false, status: 'pending' },
];

const NOTIFICATIONS = [
  { icon: 'event_available', title: 'Apel Pagi', text: 'Apel pagi hari ini pukul 07:30 WIB di halaman kantor desa.' },
  { icon: 'description', title: 'Laporan Bulanan', text: 'Laporan keuangan bulan lalu telah diverifikasi.' },
  { icon: 'warning', title: 'Pengajuan Mendesak', text: 'Ahmad Alfian mengajukan izin sakit yang menunggu persetujuan.' },
];

const STATUS_LABEL = { pending: 'Mendesak', approved: 'Disetujui', rejected: 'Ditolak' };

export default function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('beranda');
  const [staff, setStaff] = useState(STAFF_SEED);
  const [applications, setApplications] = useState(APPLICATIONS_SEED);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // 'notif' | 'addStaff' | 'staffMenu'
  const [menuStaff, setMenuStaff] = useState(null);
  const [approvalFilter, setApprovalFilter] = useState('pending'); // 'pending' | 'all'
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', role: 'Kaur Umum', nipd: '' });

  const total = staff.length;
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const hadirCount = staff.filter((s) => s.present).length;
  const attendancePct = total ? Math.round((hadirCount / total) * 100) : 0;

  const filteredStaff = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        (s.nipd && s.nipd.includes(q))
    );
  }, [staff, search]);

  const visibleApplications = useMemo(() => {
    if (approvalFilter === 'all') return applications;
    return applications.filter((a) => a.status === 'pending');
  }, [applications, approvalFilter]);

  const showToast = (msg) => setToast(msg);

  const approve = (id) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
    );
    const app = applications.find((a) => a.id === id);
    showToast(`Pengajuan ${app ? app.name : ''} disetujui`);
  };

  const reject = (id) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a))
    );
    const app = applications.find((a) => a.id === id);
    showToast(`Pengajuan ${app ? app.name : ''} ditolak`);
  };

  const togglePresent = (id) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
    const s = staff.find((x) => x.id === id);
    showToast(`${s ? s.name : ''} ${s && s.present ? 'ditandai tidak hadir' : 'ditandai hadir'}`);
  };

  const toggleStatus = (id) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'offline' : 'active' } : s
      )
    );
    const s = staff.find((x) => x.id === id);
    showToast(`Status ${s ? s.name : ''} diperbarui`);
  };

  const deleteStaff = (id) => {
    const s = staff.find((x) => x.id === id);
    setStaff((prev) => prev.filter((x) => x.id !== id));
    setMenuStaff(null);
    showToast(`${s ? s.name : ''} dihapus dari daftar perangkat`);
  };

  const addStaff = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Nama perangkat wajib diisi');
      return;
    }
    const initials = form.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const id = `${Date.now()}`;
    const palette = ['bg-primary-fixed-dim text-primary', 'bg-secondary-fixed text-secondary', 'bg-tertiary-container text-white', 'bg-surface-variant text-on-surface-variant'];
    setStaff((prev) => [
      { id, name: form.name.trim(), role: form.role, nipd: form.nipd, initials, color: palette[prev.length % palette.length], status: 'active', present: false },
      ...prev,
    ]);
    setForm({ name: '', role: 'Kaur Umum', nipd: '' });
    setModal(null);
    showToast(`${form.name.trim()} ditambahkan ke daftar perangkat`);
  };

  const openMenu = (s) => {
    setMenuStaff(s);
    setModal('staffMenu');
  };

  const StatCard = ({ label, value, sub, subClass, icon, iconClass }) => (
    <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between">
      <div>
        <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-display">{value}</span>
          {sub && <span className={`text-sm font-medium ${subClass}`}>{sub}</span>}
        </div>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl ${iconClass}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  );

  const StaffRow = ({ s }) => (
    <div className="flex items-center justify-between p-4 border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center font-bold`}>{s.initials}</div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${s.status === 'active' ? (s.present ? 'bg-green-500' : 'bg-amber-400') : 'bg-gray-300'}`} />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-on-surface">{s.name}</h5>
          <p className="text-xs text-on-surface-variant">{s.role}{s.present ? ' · Hadir' : ''}</p>
        </div>
      </div>
      <button onClick={() => openMenu(s)} className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container-low active:scale-90" aria-label="Opsi">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
    </div>
  );

  const ApplicationCard = ({ a }) => (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm">
      <div className="flex gap-4 items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">person</span>
        </div>
        <div className="flex-1">
          <h4 className="font-title-md text-title-md text-on-surface">{a.name}</h4>
          <p className="text-sm text-on-surface-variant">{a.type} • {a.date}</p>
        </div>
        {a.status === 'pending' ? (
          a.urgent && <span className="bg-error-container/20 text-on-error-container text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Mendesak</span>
        ) : (
          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${a.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-surface-variant text-on-surface-variant'}`}>{STATUS_LABEL[a.status]}</span>
        )}
      </div>
      {a.status === 'pending' ? (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => reject(a.id)} className="py-2.5 px-4 rounded-lg border border-primary text-primary font-bold text-sm active:scale-95 transition-all">Tolak</button>
          <button onClick={() => approve(a.id)} className="py-2.5 px-4 rounded-lg bg-primary text-white font-bold text-sm shadow-md active:scale-95 transition-all">Setujui</button>
        </div>
      ) : (
        <div className="py-2.5 px-4 rounded-lg bg-surface-container text-center text-sm font-semibold text-on-surface-variant">
          Sudah {STATUS_LABEL[a.status].toLowerCase()}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background pb-24 batik-overlay">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-container-padding-mobile h-16 bg-surface shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-primary-container flex items-center justify-center text-on-primary font-bold">
            IS
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Sistem Admin Desa</h1>
        </div>
        <button onClick={() => setModal('notif')} className="relative w-10 h-10 flex items-center justify-center rounded-full text-primary active:scale-95 transition-transform hover:bg-surface-variant" aria-label="Notifikasi">
          <span className="material-symbols-outlined">notifications</span>
          {pendingCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />}
        </button>
      </header>

      <main className="pt-20 px-container-padding-mobile space-y-6">
        {tab === 'beranda' && (
          <>
            <section>
              <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">DASHBOARD SEKDES</p>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Selamat Pagi, Pak Irwan</h2>
            </section>

            <section className="grid grid-cols-1 gap-4">
              <StatCard
                label="TOTAL PERANGKAT"
                value={String(total).padStart(2, '0')}
                sub="ACTIVE"
                subClass="text-green-600"
                icon="groups"
                iconClass="bg-primary-container/10 text-primary-container"
              />
              <StatCard
                label="PENGAJUAN PENDING"
                value={String(pendingCount).padStart(2, '0')}
                sub="NEED ACTION"
                subClass="text-error"
                icon="warning"
                iconClass="bg-error-container/30 text-error"
              />
              <StatCard
                label="HADIR HARI INI"
                value={String(hadirCount).padStart(2, '0')}
                sub={`${attendancePct}% Attendance`}
                subClass="text-on-surface-variant"
                icon="check_circle"
                iconClass="bg-secondary-container text-on-secondary-container"
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-title-md text-title-md text-primary">Verifikasi Pengajuan Izin</h3>
                <button onClick={() => setTab('persetujuan')} className="text-primary font-label-caps text-label-caps">LIHAT SEMUA</button>
              </div>
              <div className="space-y-3">
                {applications.filter((a) => a.status === 'pending').slice(0, 2).map((a) => (
                  <ApplicationCard key={a.id} a={a} />
                ))}
                {pendingCount === 0 && (
                  <div className="text-center py-6 bg-surface-container-lowest rounded-xl border border-outline-variant">
                    <span className="material-symbols-outlined text-on-surface-variant text-4xl">task_alt</span>
                    <p className="text-body-sm text-on-surface-variant mt-2">Tidak ada pengajuan pending.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {tab === 'staf' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-title-md text-title-md text-primary">Manajemen Perangkat</h3>
              <button onClick={() => setModal('addStaff')} className="w-8 h-8 flex items-center justify-center bg-primary-container text-white rounded-lg active:scale-90" aria-label="Tambah perangkat">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container rounded-xl border-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary text-sm transition-all outline-none"
                placeholder="Cari nama atau NIPD..."
                type="text"
              />
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              {filteredStaff.map((s) => (
                <StaffRow key={s.id} s={s} />
              ))}
              {filteredStaff.length === 0 && (
                <p className="text-center text-body-sm text-on-surface-variant py-6">Tidak ditemukan perangkat dengan kata kunci tersebut.</p>
              )}
            </div>
          </section>
        )}

        {tab === 'persetujuan' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-title-md text-title-md text-primary">Verifikasi Pengajuan Izin</h3>
              <div className="flex gap-1 bg-surface-container rounded-full p-1">
                <button onClick={() => setApprovalFilter('pending')} className={`px-3 py-1 rounded-full text-xs font-bold ${approvalFilter === 'pending' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Pending</button>
                <button onClick={() => setApprovalFilter('all')} className={`px-3 py-1 rounded-full text-xs font-bold ${approvalFilter === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>Semua</button>
              </div>
            </div>
            <div className="space-y-3">
              {visibleApplications.map((a) => (
                <ApplicationCard key={a.id} a={a} />
              ))}
              {visibleApplications.length === 0 && (
                <div className="text-center py-8 bg-surface-container-lowest rounded-xl border border-outline-variant">
                  <span className="material-symbols-outlined text-on-surface-variant text-4xl">task_alt</span>
                  <p className="text-body-sm text-on-surface-variant mt-2">Tidak ada pengajuan untuk ditampilkan.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {tab === 'laporan' && (
          <section className="space-y-4">
            <h3 className="font-title-md text-title-md text-primary px-1">Laporan Kehadiran</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                <p className="text-xs text-on-surface-variant mb-1">Total Perangkat</p>
                <p className="font-display text-3xl text-primary">{total}</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                <p className="text-xs text-on-surface-variant mb-1">Hadir Hari Ini</p>
                <p className="font-display text-3xl text-on-surface">{hadirCount}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-on-surface">Persentase Kehadiran</p>
                <p className="text-sm font-bold text-primary">{attendancePct}%</p>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-variant overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${attendancePct}%` }} />
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              <p className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-outline-variant">Daftar Perangkat Hadir</p>
              {staff.filter((s) => s.present).map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-4 border-b border-outline-variant last:border-0">
                  <div className={`w-9 h-9 rounded-full ${s.color} flex items-center justify-center font-bold text-xs`}>{s.initials}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-on-surface">{s.name}</p>
                    <p className="text-xs text-on-surface-variant">{s.role}</p>
                  </div>
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-4 bg-surface-container rounded-t-xl shadow-lg border-t border-outline-variant safe-bottom">
        {[
          { id: 'beranda', icon: 'dashboard', label: 'Beranda' },
          { id: 'staf', icon: 'groups', label: 'Staf' },
          { id: 'persetujuan', icon: 'fact_check', label: 'Persetujuan' },
          { id: 'laporan', icon: 'analytics', label: 'Laporan' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center justify-center rounded-full px-4 py-1 active:scale-90 transition-all duration-200 ${tab === t.id ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={tab === t.id ? { fontVariationSettings: '"FILL" 1' } : undefined}>{t.icon}</span>
            <span className="font-label-caps text-label-caps">{t.label}</span>
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

      {/* Modal: Tambah Perangkat */}
      {modal === 'addStaff' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Tambah Perangkat</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low"><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
            </div>
            <form onSubmit={addStaff} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Nama Lengkap</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama" className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Jabatan</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary">
                  <option>Kaur Umum</option>
                  <option>Kaur Keuangan</option>
                  <option>Kaur Kesra</option>
                  <option>Kaur Pembangunan</option>
                  <option>Kaur Pemerintahan</option>
                  <option>Kadun I</option>
                  <option>Kadun II</option>
                  <option>Sekdes</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">NIPD</label>
                <input value={form.nipd} onChange={(e) => setForm({ ...form, nipd: e.target.value })} placeholder="Nomor induk perangkat desa" className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" className="w-full h-12 bg-primary text-on-primary rounded-lg font-title-md font-bold shadow-lg active:scale-[0.98] transition-all">Simpan Perangkat</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Staff Menu (Action Sheet) */}
      {modal === 'staffMenu' && menuStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xl w-full p-2" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-outline-variant">
              <p className="text-sm font-semibold text-on-surface">{menuStaff.name}</p>
              <p className="text-xs text-on-surface-variant">{menuStaff.role}</p>
            </div>
            <button onClick={() => { togglePresent(menuStaff.id); setModal(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-on-surface hover:bg-surface-container-low rounded-lg">
              <span className="material-symbols-outlined text-primary">{menuStaff.present ? 'cancel' : 'check_circle'}</span>
              <span className="text-sm">{menuStaff.present ? 'Tandai Tidak Hadir' : 'Tandai Hadir'}</span>
            </button>
            <button onClick={() => { toggleStatus(menuStaff.id); setModal(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-on-surface hover:bg-surface-container-low rounded-lg">
              <span className="material-symbols-outlined text-primary">{menuStaff.status === 'active' ? 'do_not_disturb_on' : 'check_circle'}</span>
              <span className="text-sm">{menuStaff.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</span>
            </button>
            <button onClick={() => deleteStaff(menuStaff.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left text-error hover:bg-error-container/20 rounded-lg">
              <span className="material-symbols-outlined">delete</span>
              <span className="text-sm">Hapus Perangkat</span>
            </button>
            <button onClick={() => setModal(null)} className="w-full flex items-center justify-center px-4 py-3 mt-1 text-on-surface-variant font-semibold hover:bg-surface-container-low rounded-lg">Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
