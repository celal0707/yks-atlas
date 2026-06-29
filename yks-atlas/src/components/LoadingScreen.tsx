export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-dark-bg flex items-center justify-center z-[1000]">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-dark-border" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-500 animate-spin" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-1">YKS Atlas</h2>
          <p className="text-sm text-text-muted">Yükleniyor...</p>
        </div>
      </div>
    </div>
  );
}
