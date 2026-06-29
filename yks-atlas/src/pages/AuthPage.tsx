import { useState } from 'react';
import { googleSignIn } from '@/services/firebase';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Loader } from 'lucide-react';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initializeAuth } = useAuthContext();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await googleSignIn();
      if (result.user) {
        await initializeAuth(result.user);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      {/* Background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-green flex items-center justify-center text-white text-3xl font-bold">
              Y
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary mb-2">YKS Atlas</h1>
          <p className="text-lg text-text-secondary">Akıllı YKS Takip Sistemi</p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary mb-2">Hoş Geldin</h2>
              <p className="text-sm text-text-secondary">
                YKS hazırlığını takip etmek, sınav stratejini planlamak ve verilerini tüm cihazlarında senkronize etmek için giriş yap.
              </p>
            </div>

            {error && (
              <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google ile Giriş Yap
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-card text-text-muted">ya da</span>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-dark-border hover:bg-dark-border/80 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Demo ile Dene
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-dark-border text-center text-xs text-text-muted space-y-2">
            <p>Giriş yaparak <a href="#" className="text-primary-400 hover:underline">Kullanım Koşullarını</a> ve <a href="#" className="text-primary-400 hover:underline">Gizlilik Politikasını</a> kabul etmiş olursun.</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center text-xs text-text-secondary">
          <div>
            <div className="text-lg mb-1">📊</div>
            <div>Detaylı Analitikler</div>
          </div>
          <div>
            <div className="text-lg mb-1">☁️</div>
            <div>Bulut Senkronizasyonu</div>
          </div>
          <div>
            <div className="text-lg mb-1">🎯</div>
            <div>Akıllı Planlama</div>
          </div>
        </div>
      </div>
    </div>
  );
}
