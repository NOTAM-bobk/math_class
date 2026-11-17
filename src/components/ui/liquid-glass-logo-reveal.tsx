import * as React from "react";

/** A small, self-contained page-load version of the supplied glass logo reveal. */
export function GlassReveal21st({ onComplete }: { onComplete?: () => void }) {
  const onCompleteRef = React.useRef(onComplete);
  const completedRef = React.useRef(false);
  onCompleteRef.current = onComplete;

  const finish = React.useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  }, []);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(finish, reducedMotion ? 100 : 3900);
    return () => window.clearTimeout(timer);
  }, [finish]);

  return (
    <div
      className="glass-reveal-screen"
      role="status"
      aria-label="Loading games"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finish();
      }}
    >
      <div className="glass-reveal-stage" aria-hidden="true">
        <div className="glass-reveal-tile">
          <svg className="glass-reveal-mark" viewBox="247.7 247.8 330.4 330.4" focusable="false">
            <path fillRule="evenodd" d="M543.595 247.8C562.596 247.8 578 263.209 578 282.217V492.158C578 494.06 576.46 495.6 574.559 495.6H471.345C469.445 495.6 467.906 497.141 467.906 499.042V574.758C467.906 576.66 466.364 578.2 464.464 578.2H282.12C263.118 578.2 247.714 562.791 247.714 543.783V499.499C247.714 497.081 248.988 494.84 251.061 493.597L374.676 419.4C377.484 417.714 376.542 413.562 373.535 413.054L372.915 413H251.156C249.254 413 247.714 411.46 247.714 409.558V333.842C247.714 331.941 249.254 330.4 251.156 330.4H381.893C383.792 330.4 385.334 328.86 385.334 326.958V251.242C385.334 249.341 386.874 247.8 388.773 247.8H543.595ZM388.773 330.4C386.874 330.4 385.334 331.941 385.334 333.842V492.158C385.334 494.06 386.874 495.6 388.773 495.6H464.464C466.364 495.6 467.906 494.06 467.906 492.158V333.842C467.906 331.941 466.364 330.4 464.464 330.4H388.773Z" />
          </svg>
          <span className="glass-reveal-sheen" />
        </div>
      </div>
      <span className="glass-reveal-caption">Loading games…</span>
      <style>{`
        .glass-reveal-screen{position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;overflow:hidden;background:#09090b;color:#e4e4e7;animation:glass-screen-out .35s ease 3.55s forwards}
        .glass-reveal-stage{width:min(58vw,256px);height:min(58vw,256px);min-width:150px;min-height:150px;display:grid;place-items:center;perspective:900px}
        .glass-reveal-tile{position:relative;width:100%;height:100%;display:grid;place-items:center;overflow:hidden;border-radius:26%;transform:scale(.18);opacity:0;background:linear-gradient(145deg,rgba(255,255,255,.17),rgba(255,255,255,.025) 45%,rgba(115,160,255,.11));border:1px solid rgba(255,255,255,.42);box-shadow:inset 0 1px 1px rgba(255,255,255,.48),inset 0 -12px 28px rgba(255,255,255,.035),0 20px 60px rgba(40,94,255,.18),0 0 38px rgba(86,136,255,.11);backdrop-filter:blur(12px);animation:glass-tile-reveal 3.55s cubic-bezier(.2,.78,.24,1) forwards}
        .glass-reveal-tile:before{content:"";position:absolute;inset:2px;border-radius:inherit;background:linear-gradient(145deg,rgba(255,255,255,.2),transparent 38%,rgba(98,144,255,.08));opacity:.72}
        .glass-reveal-mark{position:relative;z-index:1;width:62%;height:62%;fill:#fff;filter:drop-shadow(0 3px 15px rgba(76,125,255,.38));transform:scale(1.85);opacity:.12;animation:glass-mark-settle 3.55s cubic-bezier(.18,.72,.22,1) forwards}
        .glass-reveal-sheen{position:absolute;z-index:2;left:-75%;top:-40%;width:45%;height:180%;transform:rotate(32deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.62),rgba(190,218,255,.14),transparent);filter:blur(3px);animation:glass-sheen 2.7s ease-in-out .55s forwards}
        .glass-reveal-caption{font:500 12px/1.2 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8b93a3;opacity:0;animation:glass-caption-in .45s ease .35s forwards}
        @keyframes glass-tile-reveal{0%{opacity:0;transform:scale(.18) rotateX(14deg);border-radius:50%;filter:blur(10px)}12%{opacity:1;transform:scale(.34) rotateX(7deg);border-radius:50%;filter:blur(1px)}27%{transform:scale(.82) rotateX(0);border-radius:43%;filter:blur(0)}52%{transform:scale(1) rotateX(0);border-radius:27%}72%{transform:scale(1) rotateX(0);border-radius:26%;box-shadow:inset 0 1px 1px rgba(255,255,255,.48),inset 0 -12px 28px rgba(255,255,255,.035),0 20px 60px rgba(40,94,255,.18),0 0 38px rgba(86,136,255,.11)}86%,100%{opacity:0;transform:scale(1.12);filter:blur(5px)}}
        @keyframes glass-mark-settle{0%,14%{opacity:.12;transform:scale(1.85);filter:blur(5px)}32%{opacity:.72;transform:scale(1.18);filter:blur(1px)}62%{opacity:1;transform:scale(1);filter:drop-shadow(0 3px 15px rgba(76,125,255,.38))}82%{opacity:1;transform:scale(1);filter:none}100%{opacity:0;transform:scale(.94)}}
        @keyframes glass-sheen{0%{left:-75%;opacity:0}18%{opacity:.9}76%{left:135%;opacity:.4}100%{left:135%;opacity:0}}
        @keyframes glass-caption-in{to{opacity:1}}
        @keyframes glass-screen-out{to{opacity:0;visibility:hidden;pointer-events:none}}
        @media(prefers-reduced-motion:reduce){.glass-reveal-tile,.glass-reveal-mark,.glass-reveal-sheen,.glass-reveal-caption,.glass-reveal-screen{animation-duration:.01ms!important;animation-delay:0ms!important}.glass-reveal-screen{animation:glass-screen-out .01ms forwards!important}}
      `}</style>
    </div>
  );
}
