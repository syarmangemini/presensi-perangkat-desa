import { useEffect, useRef, useState, useCallback } from 'react';
import { loadRecords, saveRecords, getLocalDateKey } from '../storage';

const PROFILE = {
  name: 'Budi Santoso',
  role: 'Kaur Keuangan',
  nipd: '198765432109876543',
};

function timeNow() {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function Dashboard({ onNavigate, _onLogout }) {
  const [clock, setClock] = useState(timeNow());
  const [dateStr, setDateStr] = useState('');
  const [records, setRecords] = useState(loadRecords);
  const [cameraMode, setCameraMode] = useState(null); // 'masuk' | 'pulang' | null
  const streamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [modal, setModal] = useState(null); // 'izin' | 'kalender' | 'notif' | null
  const [toast, setToast] = useState('');
  const [izin, setIzin] = useState({ jenis: 'izin', tanggal: '', keterangan: '' });
  const [izinMsg, setIzinMsg] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const todayKey = getLocalDateKey();
  const todayRecords = records.filter((r) => r.date === todayKey);
  const masuk = todayRecords.find((r) => r.type === 'masuk');
  const pulang = todayRecords.find((r) => r.type === 'pulang');

  const status = pulang
    ? { label: 'Selesai', detail: `Pulang pukul ${pulang.time}` }
    : masuk
      ? { label: 'Hadir', detail: `Masuk sejak ${masuk.time}` }
      : { label: 'Belum Presensi', detail: 'Anda belum melakukan presensi hari ini' };

  // Digital clock + date
  useEffect(() => {
    const tick = () => {
      setClock(timeNow());
      setDateStr(
        new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Toast auto dismiss
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError('');
    setPhoto(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 720, height: 720 },
        audio: false,
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError(
        err && err.name === 'NotAllowedError'
          ? 'Akses kamera ditolak. Izinkan penggunaan kamera untuk verifikasi.'
          : 'Kamera tidak tersedia di perangkat ini.'
      );
    }
  }, []);

  const openCamera = (mode) => {
    setCameraMode(mode);
    setCameraError('');
    setPhoto(null);
  };

  // Start/stop camera when mode changes
  useEffect(() => {
    if (cameraMode) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [cameraMode, startCamera, stopCamera]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL('image/jpeg', 0.8));
    stopCamera();
  };

  const submitPresensi = () => {
    if (!photo) return;
    const record = {
      id: `${Date.now()}`,
      date: todayKey,
      type: cameraMode,
      time: timeNow(),
      photo,
    };
    const next = [record, ...records];
    setRecords(next);
    saveRecords(next);
    setToast(
      cameraMode === 'masuk'
        ? `Presensi masuk berhasil pukul ${record.time}`
        : `Presensi pulang berhasil pukul ${record.time}`
    );
    setCameraMode(null);
    setPhoto(null);
  };

  const cancelCamera = () => {
    setCameraMode(null);
    setPhoto(null);
  };

  const submitIzin = (e) => {
    e.preventDefault();
    if (!izin.tanggal || !izin.keterangan.trim()) {
      setIzinMsg('Mohon lengkapi tanggal dan keterangan pengajuan.');
      return;
    }
    const next = [
      {
        id: `${Date.now()}`,
        date: izin.tanggal,
        type: 'izin',
        time: '-',
        keterangan: izin.keterangan,
        jenis: izin.jenis,
      },
      ...records,
    ];
    setRecords(next);
    saveRecords(next);
    setIzinMsg(`Pengajuan ${izin.jenis} untuk ${izin.tanggal} terkirim.`);
    setTimeout(() => {
      setModal(null);
      setIzinMsg('');
      setIzin({ jenis: 'izin', tanggal: '', keterangan: '' });
    }, 1500);
  };

  const history = records
    .filter((r) => r.type !== 'izin')
    .slice(0, 30);

  const izinList = records.filter((r) => r.type === 'izin');

  return (
    <div className="min-h-screen bg-background text-on-background pb-28">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 md:px-8 h-16 shadow-sm bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance</span>
          </div>
          <h1 className="text-title-md font-title-md font-bold text-primary">Presensi Desa</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModal('notif')}
            className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors"
            aria-label="Notifikasi"
          >
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
          </button>
          <button className="p-1 rounded-full border-2 border-primary-container" aria-label="Profil">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
          </button>
        </div>
      </header>

      <main className="pt-20 px-4 space-y-6 max-w-md mx-auto">
        {/* User Profile Header */}
        <section className="relative overflow-hidden rounded-xl bg-primary-container p-6 text-on-primary shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pattern-bg pointer-events-none" />
          <div className="relative z-10 flex flex-col">
            <span className="text-label-caps font-label-caps opacity-80 mb-1">
              {new Date().getHours() < 11 ? 'Selamat Pagi,' : new Date().getHours() < 15 ? 'Selamat Siang,' : new Date().getHours() < 19 ? 'Selamat Sore,' : 'Selamat Malam,'}
            </span>
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile mb-1">{PROFILE.name}</h2>
            <p className="text-body-sm opacity-90 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              {PROFILE.role}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="text-body-sm font-medium">{dateStr || '...'}</div>
              <div className="text-title-md font-bold tracking-wider tabular-nums">{clock}</div>
            </div>
          </div>
        </section>

        {/* Status Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${pulang ? 'bg-surface-variant text-on-surface-variant' : masuk ? 'bg-green-50 text-green-700' : 'bg-surface-variant text-on-surface-variant'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                {pulang ? 'logout' : masuk ? 'check_circle' : 'schedule'}
              </span>
            </div>
            <div>
              <h3 className="text-label-caps font-label-caps text-on-surface-variant">Status Hari Ini</h3>
              <p className={`text-title-md font-title-md ${pulang ? 'text-on-surface-variant' : masuk ? 'text-green-700' : 'text-on-surface'}`}>{status.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-body-sm text-on-surface-variant">{pulang ? 'Pulang' : 'Update'}</p>
            <p className="font-bold text-primary">{pulang ? pulang.time : masuk ? masuk.time : '--:--'}</p>
          </div>
        </section>

        {/* Presence Action Area */}
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => openCamera('masuk')}
              disabled={!!masuk}
              className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl bg-primary text-on-primary shadow-md active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
            >
              <span className="material-symbols-outlined text-3xl">login</span>
              <span className="font-title-md text-title-md">{masuk ? 'Sudah Masuk' : 'Presensi Masuk'}</span>
            </button>
            <button
              onClick={() => openCamera('pulang')}
              disabled={!masuk || !!pulang}
              className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-primary text-primary hover:bg-surface-container-low active:scale-95 transition-transform disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100"
            >
              <span className="material-symbols-outlined text-3xl">logout</span>
              <span className="font-title-md text-title-md">{pulang ? 'Sudah Pulang' : !masuk ? 'Belum Masuk' : 'Presensi Pulang'}</span>
            </button>
          </div>

          {/* Camera / Capture Section */}
          {cameraMode && (
            <div className="bg-surface-container border-2 border-dashed border-primary rounded-xl overflow-hidden relative">
              <div className="aspect-square relative bg-black">
                {photo ? (
                  <img src={photo} alt="Hasil verifikasi wajah" className="w-full h-full object-cover" />
                ) : (
                  <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
                )}
                {!photo && !cameraError && (
                  <div className="absolute inset-0 border-[3px] border-dashed border-primary/50 m-8 rounded-full pointer-events-none" />
                )}
                <button
                  onClick={cancelCamera}
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
                  aria-label="Tutup kamera"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                {!photo && !cameraError && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 animate-pulse" />
                )}
              </div>

              <div className="p-4 space-y-3">
                <p className="text-body-sm text-on-surface-variant text-center">
                  {cameraError
                    ? cameraError
                    : photo
                      ? 'Foto verifikasi berhasil diambil.'
                      : 'Posisikan wajah Anda pada bingkai untuk verifikasi biometric.'}
                </p>

                {cameraError ? (
                  <button
                    onClick={() => startCamera()}
                    className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">refresh</span> Coba Lagi
                  </button>
                ) : photo ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { setPhoto(null); startCamera(); }}
                      className="py-3 rounded-lg font-bold border-2 border-outline-variant text-on-surface flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">replay</span> Ulangi
                    </button>
                    <button
                      onClick={submitPresensi}
                      className="py-3 rounded-lg font-bold bg-primary text-on-primary shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">check</span> Kirim
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={capture}
                    className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">camera</span>
                    Ambil Foto &amp; Kirim
                  </button>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </section>

        {/* Quick Links Bento */}
        <section className="space-y-3">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant ml-1">Layanan &amp; Riwayat</h3>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setModal('izin')}
              className="flex items-center gap-4 p-4 bg-white border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="flex-1">
                <p className="text-title-md font-title-md text-on-surface">Pengajuan Izin/Cuti</p>
                <p className="text-body-sm text-on-surface-variant">Sakit, Dinas Luar, atau Cuti Tahunan</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
            <button
              onClick={() => setModal('kalender')}
              className="flex items-center gap-4 p-4 bg-white border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-tertiary-container text-white flex items-center justify-center">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <div className="flex-1">
                <p className="text-title-md font-title-md text-on-surface">Kalender Kehadiran</p>
                <p className="text-body-sm text-on-surface-variant">Lihat rekap presensi bulanan</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-primary text-on-primary px-4 py-3 rounded-lg shadow-lg text-body-sm font-medium max-w-[90%] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toast}
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface shadow-lg rounded-t-xl">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-2 transition-all">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>home</span>
          <span className="text-label-caps font-label-caps mt-1">Beranda</span>
        </button>
        <button onClick={() => openCamera(masuk ? 'pulang' : 'masuk')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 rounded-xl transition-all">
          <span className="material-symbols-outlined">camera_alt</span>
          <span className="text-label-caps font-label-caps mt-1">Presensi</span>
        </button>
        <button onClick={() => setModal('izin')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 rounded-xl transition-all">
          <span className="material-symbols-outlined">description</span>
          <span className="text-label-caps font-label-caps mt-1">Izin</span>
        </button>
        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 rounded-xl transition-all">
          <span className="material-symbols-outlined">person</span>
          <span className="text-label-caps font-label-caps mt-1">Profil</span>
        </button>
      </nav>

      {/* Modal: Pengajuan Izin/Cuti */}
      {modal === 'izin' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Pengajuan Izin/Cuti</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <form onSubmit={submitIzin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Jenis</label>
                <select
                  value={izin.jenis}
                  onChange={(e) => setIzin({ ...izin, jenis: e.target.value })}
                  className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg font-body-lg outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="izin">Izin / Sakit</option>
                  <option value="dinas">Dinas Luar</option>
                  <option value="cuti">Cuti Tahunan</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Tanggal</label>
                <input
                  type="date"
                  value={izin.tanggal}
                  onChange={(e) => setIzin({ ...izin, tanggal: e.target.value })}
                  className="w-full h-12 px-3 bg-surface border border-outline-variant rounded-lg font-body-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Keterangan</label>
                <textarea
                  rows={3}
                  value={izin.keterangan}
                  onChange={(e) => setIzin({ ...izin, keterangan: e.target.value })}
                  placeholder="Tuliskan alasan pengajuan..."
                  className="w-full p-3 bg-surface border border-outline-variant rounded-lg font-body-lg outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button type="submit" className="w-full h-12 bg-primary text-on-primary rounded-lg font-title-md font-bold shadow-lg active:scale-[0.98] transition-all">
                Kirim Pengajuan
              </button>
            </form>
            {izinMsg && <p className="text-body-sm text-primary mt-3 text-center">{izinMsg}</p>}
            {izinList.length > 0 && (
              <div className="mt-4 pt-4 border-t border-outline-variant space-y-2">
                <p className="text-label-caps font-label-caps text-on-surface-variant uppercase">Riwayat Pengajuan</p>
                {izinList.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface">
                    <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                    <div className="flex-1">
                      <p className="text-body-sm text-on-surface font-semibold capitalize">{r.jenis} · {r.date}</p>
                      <p className="text-body-sm text-on-surface-variant truncate">{r.keterangan}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Kalender Kehadiran */}
      {modal === 'kalender' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Kalender Kehadiran</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl">event_busy</span>
                <p className="text-body-sm text-on-surface-variant mt-2">Belum ada catatan presensi.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant bg-surface">
                    <span className="material-symbols-outlined text-green-700 text-[22px]">check_circle</span>
                    <div className="flex-1">
                      <p className="text-body-sm text-on-surface font-semibold">{r.date}</p>
                      <p className="text-body-sm text-on-surface-variant capitalize">{r.type === 'masuk' ? 'Presensi Masuk' : 'Presensi Pulang'} · {r.time}</p>
                    </div>
                    {r.photo && (
                      <img src={r.photo} alt="bukti" className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Notifikasi */}
      {modal === 'notif' && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setModal(null)}>
          <div className="bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-outline-variant shadow-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-md font-title-md text-primary">Notifikasi</h3>
              <button onClick={() => setModal(null)} className="p-1 rounded-full hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">event_available</span>
                <div>
                  <p className="text-body-sm text-on-surface font-semibold">Jadwal Apel Pagi</p>
                  <p className="text-body-sm text-on-surface-variant">Apel pagi hari ini pukul 07:30 WIB di halaman kantor desa.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                <div>
                  <p className="text-body-sm text-on-surface font-semibold">Laporan Bulanan</p>
                  <p className="text-body-sm text-on-surface-variant">Laporan keuangan bulan lalu telah diverifikasi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
