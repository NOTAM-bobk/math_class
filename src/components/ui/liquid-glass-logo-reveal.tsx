import * as React from "react";

/** Self-contained high-visibility 3D glass logo reveal loading screen. */
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
    const timer = window.setTimeout(finish, reducedMotion ? 80 : 3900);
    return () => window.clearTimeout(timer);
  }, [finish]);

  return (
    <div
      className="glass-reveal-screen"
      role="status"
      aria-label="Loading animation"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finish();
      }}
    >
      <div className="glass-reveal-stage" aria-hidden="true">
        <div className="glass-reveal-glow" />
        <div className="glass-reveal-tile">
          <svg className="glass-reveal-mark" viewBox="247.7 247.8 330.4 330.4" focusable="false">
            <path
              fillRule="evenodd"
              d="M543.595 247.8C562.596 247.8 578 263.209 578 282.217V492.158C578 494.06 576.46 495.6 574.559 495.6H471.345C469.445 495.6 467.906 497.141 467.906 499.042V574.758C467.906 576.66 466.364 578.2 464.464 578.2H282.12C263.118 578.2 247.714 562.791 247.714 543.783V499.499C247.714 497.081 248.988 494.84 251.061 493.597L374.676 419.4C377.484 417.714 376.542 413.562 373.535 413.054L372.915 413H251.156C249.254 413 247.714 411.46 247.714 409.558V333.842C247.714 331.941 249.254 330.4 251.156 330.4H381.893C383.792 330.4 385.334 328.86 385.334 326.958V251.242C385.334 249.341 386.874 247.8 388.773 247.8H543.595ZM388.773 330.4C386.874 330.4 385.334 331.941 385.334 333.842V492.158C385.334 494.06 386.874 495.6 388.773 495.6H464.464C466.364 495.6 467.906 494.06 467.906 492.158V333.842C467.906 331.941 466.364 330.4 464.464 330.4H388.773Z"
            />
          </svg>
          <span className="glass-reveal-sheen" />
        </div>
      </div>
      <style>{`
        .glass-reveal-screen{position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(circle at 50% 50%,#1a1d2e 0%,#0c0e17 52%,#08090d 100%);color:#f4f4f5;animation:glass-screen-out .4s ease 3.55s forwards}
        .glass-reveal-stage{position:relative;width:min(64vw,280px);height:min(64vw,280px);min-width:180px;min-height:180px;display:grid;place-items:center;perspective:900px}
        .glass-reveal-glow{position:absolute;width:130%;height:130%;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.45) 0%,rgba(129,140,248,.32) 40%,rgba(147,51,234,.12) 65%,transparent 78%);filter:blur(36px);pointer-events:none;animation:glass-glow-pulse 3.55s ease-in-out forwards}
        .glass-reveal-tile{position:relative;z-index:2;width:100%;height:100%;display:grid;place-items:center;overflow:hidden;border-radius:26%;transform:scale(.18);opacity:0;background:linear-gradient(135deg,rgba(255,255,255,.48) 0%,rgba(255,255,255,.16) 28%,rgba(125,185,255,.36) 70%,rgba(168,130,255,.28) 100%);border:2px solid rgba(255,255,255,.85);box-shadow:inset 0 2px 4px rgba(255,255,255,.95),inset 0 -8px 24px rgba(255,255,255,.25),inset 0 0 35px rgba(186,220,255,.45),0 0 65px rgba(56,189,248,.65),0 0 120px rgba(129,140,248,.45),0 28px 70px rgba(0,0,0,.75);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);animation:glass-tile-reveal 3.55s cubic-bezier(.2,.78,.24,1) forwards}
        .glass-reveal-tile:before{content:"";position:absolute;inset:2px;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,.65) 0%,rgba(255,255,255,.1) 38%,rgba(96,165,250,.28) 100%);opacity:.95;pointer-events:none}
        .glass-reveal-mark{position:relative;z-index:3;width:64%;height:64%;fill:#ffffff;filter:drop-shadow(0 0 16px rgba(255,255,255,.95)) drop-shadow(0 0 32px rgba(56,189,248,.9)) drop-shadow(0 8px 24px rgba(0,0,0,.6));transform:scale(1.7);opacity:.4;animation:glass-mark-settle 3.55s cubic-bezier(.18,.72,.22,1) forwards}
        .glass-reveal-sheen{position:absolute;z-index:4;left:-85%;top:-40%;width:55%;height:180%;transform:rotate(32deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.98),rgba(191,219,254,.7),transparent);filter:blur(2px);animation:glass-sheen 2.7s ease-in-out .55s forwards}
        @keyframes glass-tile-reveal{0%{opacity:0;transform:scale(.18) rotateX(14deg);border-radius:50%;filter:blur(10px)}12%{opacity:1;transform:scale(.36) rotateX(7deg);border-radius:50%;filter:blur(1px)}27%{transform:scale(.84) rotateX(0);border-radius:43%;filter:blur(0)}52%{transform:scale(1) rotateX(0);border-radius:27%}72%{transform:scale(1) rotateX(0);border-radius:26%;box-shadow:inset 0 2px 4px rgba(255,255,255,.95),inset 0 -8px 24px rgba(255,255,255,.25),inset 0 0 35px rgba(186,220,255,.45),0 0 65px rgba(56,189,248,.65),0 0 120px rgba(129,140,248,.45),0 28px 70px rgba(0,0,0,.75)}86%,100%{opacity:0;transform:scale(1.14);filter:blur(5px)}}
        @keyframes glass-mark-settle{0%,14%{opacity:.4;transform:scale(1.7);filter:blur(3px) drop-shadow(0 0 14px rgba(255,255,255,.95))}30%{opacity:.95;transform:scale(1.15);filter:blur(0) drop-shadow(0 0 22px rgba(255,255,255,1)) drop-shadow(0 0 38px rgba(56,189,248,.95))}60%{opacity:1;transform:scale(1);filter:drop-shadow(0 0 24px rgba(255,255,255,1)) drop-shadow(0 0 45px rgba(56,189,248,.95))}82%{opacity:1;transform:scale(1);filter:drop-shadow(0 0 18px rgba(255,255,255,.95))}100%{opacity:0;transform:scale(.94)}}
        @keyframes glass-glow-pulse{0%{opacity:0;transform:scale(.3)}25%{opacity:.95;transform:scale(1.08)}70%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.2)}}
        @keyframes glass-sheen{0%{left:-85%;opacity:0}18%{opacity:1}76%{left:145%;opacity:.5}100%{left:145%;opacity:0}}
        @keyframes glass-screen-out{to{opacity:0;visibility:hidden;pointer-events:none}}
        @media(prefers-reduced-motion:reduce){.glass-reveal-tile,.glass-reveal-mark,.glass-reveal-sheen,.glass-reveal-glow,.glass-reveal-screen{animation-duration:.01ms!important;animation-delay:0ms!important}.glass-reveal-screen{animation:glass-screen-out .01ms forwards!important}}
      `}</style>
    </div>
  );
}
