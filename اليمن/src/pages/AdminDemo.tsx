import { Check, Clock3, Eye, LayoutDashboard, ShieldAlert, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';

type DemoSubmission = {
  id: string;
  wallet: string;
  prize: string;
  status: 'قيد المراجعة' | 'تم الاعتماد' | 'مرفوض';
  time: string;
};

const INITIAL_SUBMISSIONS: DemoSubmission[] = [
  { id: 'DEMO-1048', wallet: '•••• 2841', prize: 'آيفون 17 برو', status: 'قيد المراجعة', time: 'منذ دقيقتين' },
  { id: 'DEMO-1047', wallet: '•••• 9016', prize: 'سيارة', status: 'تم الاعتماد', time: 'منذ 8 دقائق' },
  { id: 'DEMO-1046', wallet: '•••• 3372', prize: 'رحلة سياحية', status: 'مرفوض', time: 'منذ 15 دقيقة' },
  { id: 'DEMO-1045', wallet: '•••• 7120', prize: 'لابتوب', status: 'قيد المراجعة', time: 'منذ 22 دقيقة' },
];

const statusStyles: Record<DemoSubmission['status'], string> = {
  'قيد المراجعة': 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  'تم الاعتماد': 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  مرفوض: 'bg-red-400/10 text-red-300 border-red-400/20',
};

export default function AdminDemo() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [selected, setSelected] = useState<DemoSubmission | null>(null);

  const setStatus = (id: string, status: DemoSubmission['status']) => {
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === id ? { ...submission, status } : submission,
      ),
    );
    setSelected((current) => (current?.id === id ? { ...current, status } : current));
  };

  const pending = submissions.filter((submission) => submission.status === 'قيد المراجعة').length;
  const approved = submissions.filter((submission) => submission.status === 'تم الاعتماد').length;
  const rejected = submissions.filter((submission) => submission.status === 'مرفوض').length;

  return (
    <main dir="rtl" className="min-h-dvh bg-background px-5 py-6 text-foreground sm:px-8">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="جيب Jaib" className="h-auto w-[76px]" />
          <div className="hidden h-8 w-px bg-border sm:block" />
          <div className="hidden sm:block">
            <p className="text-sm font-extrabold">لوحة الإدارة</p>
            <p className="text-[11px] text-muted-foreground">نسخة تجريبية للعرض فقط</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
          <LayoutDashboard size={15} />
          الوضع التجريبي
        </div>
      </header>

      <section className="mx-auto max-w-6xl pt-8">
        <div className="mb-7">
          <p className="text-sm font-bold text-primary">مرحبًا بك</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">طلبات الجوائز</h1>
          <p className="mt-2 text-sm text-muted-foreground">راجع الحالات الوهمية لتقييم شكل لوحة الإدارة.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={<Clock3 size={19} />} label="قيد المراجعة" value={pending} tone="amber" />
          <SummaryCard icon={<Check size={19} />} label="تم الاعتماد" value={approved} tone="green" />
          <SummaryCard icon={<ShieldAlert size={19} />} label="مرفوضة" value={rejected} tone="red" />
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-extrabold">آخر الطلبات</h2>
              <p className="mt-1 text-xs text-muted-foreground">بيانات وهمية وغير مرتبطة بقاعدة البيانات</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">{submissions.length} طلبات</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-right text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-bold">رقم الطلب</th>
                  <th className="px-5 py-4 font-bold">المحفظة</th>
                  <th className="px-5 py-4 font-bold">الجائزة</th>
                  <th className="px-5 py-4 font-bold">الحالة</th>
                  <th className="px-5 py-4 font-bold">الوقت</th>
                  <th className="px-5 py-4 font-bold">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-t border-border transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-4 font-bold">{submission.id}</td>
                    <td dir="ltr" className="px-5 py-4 text-right text-muted-foreground">{submission.wallet}</td>
                    <td className="px-5 py-4 font-bold">{submission.prize}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[submission.status]}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{submission.time}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelected(submission)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        <Eye size={14} />
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-5 backdrop-blur-sm">
          <div className="w-full max-w-[380px] rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-primary">تفاصيل تجريبية</p>
                <h2 className="mt-1 text-xl font-extrabold">{selected.id}</h2>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground" aria-label="إغلاق">
                <X size={20} />
              </button>
            </div>
            <div className="mt-5 space-y-3 rounded-2xl bg-secondary/60 p-4 text-sm">
              <DetailRow label="المحفظة" value={selected.wallet} />
              <DetailRow label="الجائزة" value={selected.prize} />
              <DetailRow label="الرمز" value="غير محفوظ في النسخة الآمنة" />
            </div>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setStatus(selected.id, 'تم الاعتماد')} className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-extrabold text-white transition-colors hover:bg-emerald-500">
                اعتماد تجريبي
              </button>
              <button type="button" onClick={() => setStatus(selected.id, 'مرفوض')} className="flex-1 rounded-xl bg-red-700 py-3 text-xs font-extrabold text-white transition-colors hover:bg-red-600">
                رفض تجريبي
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number; tone: 'amber' | 'green' | 'red' }) {
  const styles = {
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    red: 'border-red-400/20 bg-red-400/10 text-red-300',
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xl">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${styles[tone]}`}>{icon}</div>
      <p className="mt-5 text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-extrabold">{value}</span>
    </div>
  );
}
