import { Card, CardHeader } from '@/components/Common';

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">{title}</h1>
        <p className="text-text-secondary">{description}</p>
      </div>

      <Card>
        <CardHeader title="Çalışmalar Devam Ediyor" />
        <div className="py-12 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Bu sayfa yakında hazır olacak</h3>
          <p className="text-text-muted">YKS Atlas'ı daha iyileştirmek için çalışıyoruz...</p>
        </div>
      </Card>
    </div>
  );
}
