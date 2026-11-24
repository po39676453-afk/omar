import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

type Prize = {
  name: string;
  img: string;
};

const PRIZES: Prize[] = [
  { name: 'سيارة', img: '/car.png' },
  { name: 'آيفون 17 برو', img: '/iphone.png' },
  { name: 'آيباد برو', img: '/ipad.png' },
  { name: 'لابتوب', img: '/laptop.png' },
  { name: 'بلايستيشن 5', img: '/ps5.png' },
  { name: 'ساعة ذكية', img: '/watch.png' },
  { name: 'سماعات AirPods', img: '/airpods.png' },
  { name: 'رحلة سياحية', img: '/trip.png' },
];

const SEGMENT = 360 / PRIZES.length;
const SPIN_MS = 4000;

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

function unlockAudio() {
  getAudioContext();
}

function playTick() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 1500 + Math.random() * 400;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.07);
}

function playSpinTicks(durationMs: number, tickCount: number) {
  const ctx = getAudioContext();
  const start = performance.now();
  let last = 0;
  const ease = (t: number) => 1 - Math.pow(1 - t, 3.4);
  const loop = () => {
    const progress = Math.min(1, (performance.now() - start) / durationMs);
    const tick = Math.floor(ease(progress) * tickCount);
    if (tick > last) {
      last = tick;
      playTick();
    }
    if (progress < 1) {
      requestAnimationFrame(loop);
    }
  };
  requestAnimationFrame(loop);
}

function playWinNote(freq: number, at: number, duration: number, volume = 0.09) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + duration + 0.05);
}

function playWinFanfare() {
  const base = getAudioContext().currentTime + 0.05;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    playWinNote(freq, base + i * 0.12, 0.35),
  );
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq) =>
    playWinNote(freq, base + 0.55, 0.8, 0.07),
  );
}

type WheelPageProps = {
  onPrize: (prize: string) => void;
};

export default function WheelPage({ onPrize }: WheelPageProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);

  const spin = () => {
    if (spinning) return;
    unlockAudio();
    const index = Math.floor(Math.random() * PRIZES.length);
    const target = 360 - (index * SEGMENT + SEGMENT / 2);
    const next = rotation - (rotation % 360) + 2520 + target;
    const ticks = Math.round((next - rotation) / SEGMENT);
    setRotation(next);
    setSpinning(true);
    playSpinTicks(SPIN_MS, ticks);
    setTimeout(() => {
      setSpinning(false);
      setWinner(PRIZES[index]);
      playWinFanfare();
    }, SPIN_MS);
  };

  const gradient = PRIZES.map(
    (prize, i) =>
      `${i % 2 === 0 ? 'var(--primary)' : 'var(--card)'} ${i * SEGMENT}deg ${
        (i + 1) * SEGMENT
      }deg`,
  ).join(', ');

  return (
    <main
      className="page-entrance flex h-dvh flex-col items-center overflow-hidden bg-background px-5 pt-4 text-center"
      dir="rtl"
    >
      <img
        src="/logo.png"
        alt="جيب Jaib"
        width={1479}
        height={586}
        className="animate-logo h-auto w-[104px]"
      />
      <h1 className="animate-word mt-3 text-2xl font-extrabold text-foreground">
        عجلة الجوائز القيمة
      </h1>
      <p className="animate-word mt-1 text-sm text-muted-foreground">
        لف العجلة واكتشف جائزتك
      </p>

      <div className="relative mt-4 aspect-square w-[min(84vw,340px)]">
        <div className="absolute -top-2 left-1/2 z-20 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[26px] border-x-transparent border-t-foreground drop-shadow-lg" />
        <div
          className="relative h-full w-full rounded-full border-[6px] border-foreground shadow-2xl"
          style={{
            background: `conic-gradient(${gradient})`,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.21, 1)`
              : 'none',
          }}
        >
          {PRIZES.map((prize, i) => (
            <div
              key={prize.name}
              className="absolute inset-0 flex justify-center"
              style={{ transform: `rotate(${i * SEGMENT + SEGMENT / 2}deg)` }}
            >
              <div className="mt-2.5 flex max-w-[74px] flex-col items-center">
                <img
                  src={prize.img}
                  alt=""
                  loading="lazy"
                  className="h-9 w-9 object-contain drop-shadow-md sm:h-11 sm:w-11"
                />
                <span className="mt-0.5 text-[10px] font-extrabold leading-tight text-foreground sm:text-[11px]">
                  {prize.name}
                </span>
              </div>
            </div>
          ))}
          <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary bg-foreground" />
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="animate-prize-button relative mt-6 inline-flex h-[58px] min-w-[290px] items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 text-base font-extrabold text-primary-foreground shadow-2xl disabled:opacity-70"
      >
        <Sparkles size={20} />
        {spinning ? 'العجلة تلف...' : 'لف العجلة وشاهد هديتك'}
        <span className="button-shine absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-primary-foreground/25" />
      </button>

      {winner && (
        <div className="win-backdrop fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm">
          <div
            aria-hidden="true"
            className="win-confetti pointer-events-none absolute inset-0 overflow-hidden"
          >
            <span className="win-bit win-bit-1" />
            <span className="win-bit win-bit-2" />
            <span className="win-bit win-bit-3" />
            <span className="win-bit win-bit-4" />
            <span className="win-bit win-bit-5" />
            <span className="win-bit win-bit-6" />
            <span className="win-bit win-bit-7" />
            <span className="win-bit win-bit-8" />
          </div>
          <div className="win-panel relative w-full max-w-[340px] overflow-hidden rounded-3xl border border-primary/50 bg-card p-7 shadow-2xl">
            <div
              aria-hidden="true"
              className="win-rays pointer-events-none absolute inset-x-0 top-0 h-40"
            />
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <span
                aria-hidden="true"
                className="win-halo absolute inset-0 rounded-full"
              />
              <span
                aria-hidden="true"
                className="win-halo win-halo-late absolute inset-0 rounded-full"
              />
              <img
                src={winner.img}
                alt={winner.name}
                className="win-prize relative h-28 w-28 object-contain drop-shadow-2xl"
              />
            </div>
            <h2 className="win-rise relative mt-4 text-3xl font-extrabold text-foreground">
              مبروك! 🎉
            </h2>
            <p className="win-rise win-rise-1 relative mt-2 text-base text-muted-foreground">
              لقد ربحت معنا
            </p>
            <p className="win-rise win-rise-2 relative mt-2 text-3xl font-extrabold text-primary">
              {winner.name}
            </p>
            <button
              onClick={() => onPrize(winner.name)}
              className="group win-rise win-rise-3 relative mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-lg font-extrabold text-primary-foreground shadow-xl transition-transform hover:scale-[1.03]"
            >
              التالي
              <ArrowLeft
                size={20}
                className="transition-transform group-hover:-translate-x-1"
              />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
