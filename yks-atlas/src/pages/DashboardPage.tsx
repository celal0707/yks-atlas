import { useStore } from '@/store';
import { Card, CardHeader, CardBody, Metric, Progress, Button } from '@/components/Common';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateNet, calculateDaysUntilExam } from '@/utils/helpers';
import { TrendingUp, Zap, Target, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user, tasks, exams, subjects, stats } = useStore();

  // Calculate metrics
  const daysUntilExam = calculateDaysUntilExam(user?.examDate || '');
  const totalSubjects = Object.keys(subjects).length;
  const completedSubjects = Object.values(subjects).filter(
    (s) => Object.values(s.topics || {}).every((t) => t.status === 'bitti')
  ).length;
  const openTasks = tasks.filter((t) => !t.done).length;
  const completedTasks = tasks.filter((t) => t.done).length;

  // Chart data
  const examTrendData = exams.slice(-10).map((e, i) => ({
    name: `Deneme ${i + 1}`,
    net: calculateNet(
      e.sections.reduce((a, s) => a + s.correct, 0),
      e.sections.reduce((a, s) => a + s.wrong, 0)
    ),
  }));

  const subjectProgressData = Object.entries(subjects).map(([name, s]) => {
    const total = Object.keys(s.topics || {}).length;
    const completed = Object.values(s.topics || {}).filter((t) => t.status === 'bitti').length;
    return { name, completed, total, incomplete: total - completed };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Hoş geldin, {user?.displayName}! 👋
          </h1>
          <p className="text-text-secondary">
            Sınava {daysUntilExam} gün kaldı. Harika bir gün geçir! 🚀
          </p>
        </div>
        <Button variant="primary" size="lg">
          Yeni Deneme Ekle
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric
          label="Konu İlerlemesi"
          value={completedSubjects}
          unit={`/ ${totalSubjects}`}
          icon={<BookOpen className="w-5 h-5" />}
          subtext="Bitti/Toplam"
        />
        <Metric
          label="Net (Son Deneme)"
          value={exams.length > 0 ? calculateNet(
            exams[exams.length - 1].sections.reduce((a, s) => a + s.correct, 0),
            exams[exams.length - 1].sections.reduce((a, s) => a + s.wrong, 0)
          ).toFixed(1) : '—'}
          icon={<Target className="w-5 h-5" />}
          highlight={true}
        />
        <Metric
          label="Tamamlanan Görev"
          value={completedTasks}
          unit={`/ ${tasks.length}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <Metric
          label="XP Puanı"
          value={stats?.xp || 0}
          icon={<Zap className="w-5 h-5" />}
          subtext={`Seviye ${stats?.level || 1}`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Trend */}
        <Card>
          <CardHeader title="Net Gelişimi" subtitle="Son 10 deneme" />
          <CardBody>
            {examTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={examTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2E2740" />
                  <XAxis dataKey="name" stroke="#B6B0BF" fontSize={12} />
                  <YAxis stroke="#B6B0BF" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1B1828', border: '1px solid #2E2740' }}
                    formatter={(value) => `${value.toFixed(1)} net`}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#A593D6"
                    dot={{ fill: '#A593D6' }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-text-muted">
                Henüz deneme kaydı yok
              </div>
            )}
          </CardBody>
        </Card>

        {/* Subject Progress */}
        <Card>
          <CardHeader title="Ders Dağılımı" subtitle="Konular" />
          <CardBody className="space-y-3">
            {subjectProgressData.slice(0, 5).map((s) => (
              <Progress
                key={s.name}
                label={s.name}
                value={s.completed}
                max={s.total}
                color={s.completed === s.total ? 'success' : 'primary'}
              />
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Recent exams & tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams */}
        <Card>
          <CardHeader title="Son Denemeler" subtitle={`${exams.length} toplam`} />
          <CardBody>
            {exams.length > 0 ? (
              <div className="space-y-2">
                {exams.slice(-5).reverse().map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{e.name}</div>
                      <div className="text-xs text-text-muted">{new Date(e.date).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div className="font-semibold text-accent-green">
                      {calculateNet(
                        e.sections.reduce((a, s) => a + s.correct, 0),
                        e.sections.reduce((a, s) => a + s.wrong, 0)
                      ).toFixed(1)} net
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">Henüz deneme eklenmedi</div>
            )}
          </CardBody>
        </Card>

        {/* Open Tasks */}
        <Card>
          <CardHeader title="Açık Görevler" subtitle={`${openTasks} tamamlanmamış`} />
          <CardBody>
            {openTasks > 0 ? (
              <div className="space-y-2">
                {tasks
                  .filter((t) => !t.done)
                  .slice(0, 5)
                  .map((t) => (
                    <div key={t.id} className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg">
                      <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{t.title}</div>
                        {t.subject && <div className="text-xs text-text-muted">{t.subject}</div>}
                      </div>
                      {t.priority && (
                        <div className={`text-xs font-semibold ${
                          t.priority === 'yüksek' ? 'text-accent-red' :
                          t.priority === 'normal' ? 'text-accent-orange' :
                          'text-text-muted'
                        }`}>
                          {t.priority}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">Tüm görevler tamamlandı! 🎉</div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
