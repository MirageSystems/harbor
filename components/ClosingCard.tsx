export function ClosingCard({ text }: { text: string }) {
  return (
    <div className="flex justify-center bg-surface px-6 py-20">
      {/*
        Default: Fraunces italic — a deliberate quiet contrast against the
        loud palette everywhere else.

        To match the louder direction instead, swap the className below to:
        "text-center font-display text-3xl font-bold leading-9 text-ink"
      */}
      <p className="text-center font-closing text-3xl italic leading-9 text-ink">
        {text}
      </p>
    </div>
  );
}
