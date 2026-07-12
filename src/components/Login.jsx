import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { username, password });
    alert('Fitur login akan terhubung ke backend.');
  };

  const handleRoleSelect = (role) => {
    console.log('Role selected:', role);
  };

  return (
    <div className="flex flex-col min-h-screen text-on-surface overflow-x-hidden">
      {/* Top Branding Section */}
      <header className="flex flex-col items-center justify-center pt-16 pb-8 px-container-padding-mobile">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl"></div>
          <div className="relative w-20 h-20 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>account_balance</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-extrabold">Presensi PemDes</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Sistem Presensi Digital Perangkat Desa</p>
        </div>
      </header>

      {/* Login Form Section */}
      <main className="flex-grow px-container-padding-mobile">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="font-title-md text-title-md text-primary">Masuk ke Akun</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Silakan masukkan NIPD dan kata sandi Anda.</p>
          </div>
          <form id="loginForm" className="space-y-5" onSubmit={handleSubmit}>
            {/* NIPD / Username Field */}
            <div className="space-y-3 mb-6">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">PILIH PERAN MASUK</label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => handleRoleSelect('admin')} className="flex flex-col items-center justify-center p-3 rounded-lg border border-outline-variant bg-surface hover:border-primary transition-all group">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary mb-1">admin_panel_settings</span>
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase">Admin</span>
                </button>
                <button type="button" onClick={() => handleRoleSelect('kadus')} className="flex flex-col items-center justify-center p-3 rounded-lg border border-outline-variant bg-surface hover:border-primary transition-all group">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary mb-1">account_balance</span>
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase">Kepala Desa</span>
                </button>
                <button type="button" onClick={() => handleRoleSelect('perangkat')} className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-primary bg-primary/5 transition-all group">
                  <span className="material-symbols-outlined text-primary mb-1">badge</span>
                  <span className="text-[10px] font-bold text-primary uppercase">Perangkat</span>
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="username" className="font-label-caps text-label-caps text-on-surface-variant uppercase">NIPD / Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">badge</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan NIPD Anda"
                  className="w-full h-12 pl-10 pr-4 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body-lg text-body-lg outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="font-label-caps text-label-caps text-on-surface-variant uppercase">Kata Sandi</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-12 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body-lg text-body-lg outline-none"
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                  <span id="passwordToggleIcon" className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer h-5 w-5 border-outline-variant rounded text-primary focus:ring-primary" />
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">Ingat Saya</span>
              </label>
              <a href="#" className="font-body-sm text-body-sm text-primary font-semibold hover:underline decoration-2 underline-offset-4">Lupa Kata Sandi?</a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full h-[56px] bg-primary text-on-primary rounded-lg font-title-md text-title-md font-bold shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 relative overflow-hidden">
              <span>Masuk</span>
              <span className="material-symbols-outlined">login</span>
            </button>
          </form>
          <div className="mt-10 pt-6 border-t border-outline-variant text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Belum memiliki akun? <br />
              <a href="#" className="text-primary font-bold">Hubungi Administrator Desa</a>
            </p>
          </div>
        </div>
      </main>

      {/* Visual Identity Content */}
      <div className="w-full max-w-sm mx-auto px-container-padding-mobile mt-8 mb-4">
        <div className="aspect-video relative rounded-xl overflow-hidden shadow-sm border border-outline-variant">
          <img
            className="w-full h-full object-cover"
            data-alt="A professional architectural photograph of a modern Indonesian village government office building with clean lines, white walls, and blue accents. The lighting is bright and clear morning sun, creating a sense of official stability and administrative transparency. The atmosphere is quiet, organized, and technologically integrated, representing a high-standard civil service environment."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGMd2MvYbE-jbduDD5lgzhgvbd2ezeoa1cEeIPAVygyfiNprwMw6fX0nvQ-i-vrWO8-DhkAxVQ2PZ0vHAxRHszydLO4e0aG4080mhJN9uArBD1YY2iD-UujdzQdu52dgwqg5HfVKFOinqVIMGrmiUcyCHszPMdzp2zxLMADo0cvSzDaJOLTQ8dluVi1JnR_PKStMwEExQSzwsscrceFQSwvMEC91xcuh37m5eCPxRccUGEAfG69ZjMcevG24o-MdUiYUg-VNLorgs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-4">
            <p className="text-white font-label-caps text-label-caps opacity-90">LAYANAN PUBLIK DIGITAL</p>
            <p className="text-white font-title-md text-title-md leading-tight">Transparansi &amp; Akuntabilitas Aparatur Desa</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="py-8 px-container-padding-mobile text-center mt-auto">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 opacity-40 grayscale brightness-0">
            <span className="material-symbols-outlined text-[32px]">account_balance</span>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Pemerintah Desa PILOLIYANGA</p>
            <p className="text-[10px] text-outline mt-1 uppercase tracking-tighter">Powered by Civic Presence v2.4.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
