import { useStore } from '@/store';
import { Card, CardHeader, Metric, Progress } from '@/components/Common';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateNet, calculateAccuracy, getDaysArray } from '@/utils/helpers';
import { TrendingUp, Target, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const { exams, subjects, mistakes } = useStore();

  // Calculate daily stats
  const days = getDaysArray(7);
  const dailyData = days.map(date => {
    const dayExams = exams.filter(e => e.date === date);
    const dayMistakes = mistakes.filter(m => new Date(m.createdAt).toISOString().split('T')[0] === date);

    const totalCorrect = dayExams.reduce((a, e) => a + e.sections.reduce((s: number, sec: any) => s + sec.correct, 0), 0);
    const totalWrong = dayExams.reduce((a, e) => a + e.sections.reduce((s: number, sec: any) => s + sec.wrong, 0), 0);

    return {
      date: date.split('-')[2],
      net: calculateNet(totalCorrect, totalWrong),
      mistakes: dayMistakes.length,
      exams: dayExams.length,
    };
  });

  // Subject performance
  const subjectData = Object.entries(subjects).map(([name, subject]) => {
    const topics = subject.topics || {};
    const completed = Object.values(topics).filter((t: any) => t.status === 'bitti').length;
    const total = Object.keys(topics).length;

    const totalCorrect = Object.values(topics).reduce((a: number, t: any) => a + (t.correct || 0), 0);
    const totalWrong = Object.values(topics).reduce((a: number, t: any) => a + (t.wrong || 0), 0);

    return {
      name,
      completed,
      total,
      accuracy: calculateAccuracy(totalCorrect, totalWrong),
      net: calculateNet(totalCorrect, totalWrong),
    };
  });

  // Mistake categories
  const categoryData = [
    { name: 'Kavram Hatası', value: mistakes.filter(m => m.category === 'kavram_hatasi').length, fill: '#E5836A' },
    { name: 'İşlem Hatası', value: mistakes.filter(m => m.category === 'isllem_hatasi').length, fill: '#FF9800' },
    { name: 'Dikkatsizlik', value: mistakes.filter(m => m.category === 'dikkatsizlik').length, fill: '#DFB244' },
    { name: 'Bilgi Boşluğu', value: mistakes.filter(m => m.category === 'bilgi_boslugu').length, fill: '#5ECBAD' },
  ];

  // Summary stats
  const totalCorrect = exams.reduce((a, e) => a + e.sections.reduce((s: number, sec: any) => s + sec.correct, 0), 0);
  const totalWrong = exams.reduce((a, e) => a + e.sections.reduce((s: number, sec: any) => s + sec.wrong, 0), 0);
  const totalQuestions = totalCorrect + totalWrong;
  const averageAccuracy = totalQuestions > 0 ? calculateAccuracy(totalCorrect, totalWrong) : 0;
  const totalNet = calculateNet(totalCorrect, totalWrong);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary">Analitikler</h1>
        <p className="text-text-secondary">Detaylı istatistikler ve performans analizi</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric
          label="Toplam Net"
          value={totalNet.toFixed(1)}
          icon={<Target className="w-5 h-5" />}
          highlight
        />
        <Metric
          label="Ortalama Doğruluk"
          value={averageAccuracy}
          unit="%"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <Metric
          label="Toplam Soru"
          value={totalQuestions}
          icon={<Zap className="w-5 h-5" />}
        />
        <Metric
          label="Kaydedilen Hata"
          value={mistakes.length}
          unit="hata"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Trend */}
        <Card>
          <CardHeader title="Günlük Net Gelişimi" subtitle="Son 7 gün" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2740" />
                <XAxis dataKey="date" stroke="#B6B0BF" fontSize={12} />
                <YAxis stroke="#B6B0BF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1B1828', border: '1px solid #2E2740' }} />
                <Line type="monotone" dataKey="net" stroke="#A593D6" dot={{ fill: '#A593D6' }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Accuracy by Subject */}
        <Card>
          <CardHeader title="Ders Bazlı Doğruluk" />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2740" />
                <XAxis dataKey="name" stroke="#B6B0BF" fontSize={10} />
                <YAxis stroke="#B6B0BF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1B1828', border: '1px solid #2E2740' }} />
                <Bar dataKey="accuracy" fill="#A593D6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Mistake Categories */}
        {mistakes.length > 0 && (
          <Card>
            <CardHeader title="Hata Kategorileri" />
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.filter(c => c.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Subject Progress */}
        <Card>
          <CardHeader title="Konu İlerleme" subtitle={`${Object.keys(subjects).length} ders`} />
          <div className="space-y-3">
            {subjectData.slice(0, 5).map(subject => (
              <div key={subject.name}>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">{subject.name}</div>
                  <div className="text-xs text-accent-green font-semibold">{subject.completed}/{subject.total}</div>
                </div>
                <Progress value={subject.completed} max={subject.total} color="success" showPercent={false} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Subject Stats */}
      <Card>
        <CardHeader title="Ders Detayları" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-2 px-3 text-text-secondary font-semibold">Ders</th>
                <th className="text-right py-2 px-3 text-text-secondary font-semibold">Konular</th>
                <th className="text-right py-2 px-3 text-text-secondary font-semibold">Net</th>
                <th className="text-right py-2 px-3 text-text-secondary font-semibold">Doğruluk</th>
              </tr>
            </thead>
            <tbody>
              {subjectData.map(subject => (
                <tr key={subject.name} className="border-b border-dark-border hover:bg-dark-bg">
                  <td className="py-2 px-3 text-text-primary">{subject.name}</td>
                  <td className="text-right py-2 px-3 text-text-secondary">{subject.completed}/{subject.total}</td>
                  <td className="text-right py-2 px-3 text-accent-green font-semibold">{subject.net.toFixed(1)}</td>
                  <td className="text-right py-2 px-3 text-text-secondary">{subject.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
