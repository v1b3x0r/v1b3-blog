interface DoiSuthepProps {
  ridges?: 1 | 2 | 3;
  withTemple?: boolean;
}

export function DoiSuthep({ ridges = 3, withTemple = true }: DoiSuthepProps) {
  return (
    <>
      {ridges >= 3 && (
        <div className="mountain mountain-far" aria-hidden="true">
          <svg viewBox="0 0 200 30" preserveAspectRatio="none">
            <path d="M0,30 L0,22 L8,18 L18,21 L28,15 L42,19 L55,12 L68,18 L82,14 L98,8 L112,16 L128,11 L142,17 L158,13 L172,20 L186,15 L200,22 L200,30 Z" />
          </svg>
        </div>
      )}
      {ridges >= 2 && (
        <div className="mountain mountain-mid" aria-hidden="true">
          <svg viewBox="0 0 200 35" preserveAspectRatio="none">
            <path d="M0,35 L0,18 L12,14 L24,22 L38,10 L52,15 L65,6 L78,12 L90,4 L105,11 L120,7 L135,15 L148,8 L162,13 L178,18 L200,12 L200,35 Z" />
          </svg>
        </div>
      )}
      <div className="mountain mountain-near" aria-hidden="true">
        <svg viewBox="0 0 200 50" preserveAspectRatio="none">
          <path d="M0,50 L0,25 L8,18 L20,28 L35,15 L48,22 L62,10 L75,18 L88,8 L102,14 L115,22 L130,12 L145,20 L160,16 L175,25 L188,18 L200,28 L200,50 Z" />
          {withTemple && <path d="M62,10 L60,7 L62,5 L64,7 L62,10 Z" />}
        </svg>
      </div>
    </>
  );
}
