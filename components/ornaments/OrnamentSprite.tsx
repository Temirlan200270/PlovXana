export function OrnamentSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        {/* Placeholder ornament (to be replaced with final SVG paths). */}
        <symbol id="kazakh-main" viewBox="0 0 80 80">
          <path
            d="M40 6c6 0 8 8 12 12s12 6 12 12-8 8-12 12-6 12-12 12-8-8-12-12-12-6-12-12 8-8 12-12S34 6 40 6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M16 40h48M40 16v48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.65"
            vectorEffect="non-scaling-stroke"
          />
        </symbol>

        <symbol id="plate-default" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="#2A1810"
            stroke="#C9A961"
            strokeWidth="1"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#1A4A6B"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#C9A961"
            strokeWidth="0.5"
            strokeDasharray="3 2"
          />
          <path
            d="M50 34c7 0 9 6 12 9s9 5 9 12-6 9-9 12-5 9-12 9-9-6-12-9-9-5-9-12 6-9 9-12 5-9 12-9Z"
            fill="none"
            stroke="#C9A961"
            strokeWidth="1"
            opacity="0.9"
          />
        </symbol>

        <symbol id="plate-plov" viewBox="0 0 100 100">
          <use href="#plate-default" />
          <path
            d="M32 54c8-10 28-10 36 0"
            fill="none"
            stroke="#D66A3A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M36 60c7-6 21-6 28 0"
            fill="none"
            stroke="#E8C982"
            strokeWidth="1.5"
            opacity="0.9"
            strokeLinecap="round"
          />
        </symbol>

        <symbol id="plate-kazy" viewBox="0 0 100 100">
          <use href="#plate-default" />
          <path
            d="M35 45c10 10 20 10 30 0"
            fill="none"
            stroke="#8B2D1A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M35 55c10 10 20 10 30 0"
            fill="none"
            stroke="#D66A3A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </symbol>

        <symbol id="plate-samsa" viewBox="0 0 100 100">
          <use href="#plate-default" />
          <path
            d="M50 38l16 18-16 18-16-18 16-18Z"
            fill="none"
            stroke="#E8C982"
            strokeWidth="1.6"
          />
          <path
            d="M50 44l10 12-10 12-10-12 10-12Z"
            fill="none"
            stroke="#C9A961"
            strokeWidth="1.1"
            opacity="0.9"
          />
        </symbol>

        <symbol id="plate-tea" viewBox="0 0 100 100">
          <use href="#plate-default" />
          <path
            d="M40 62c2 6 18 6 20 0"
            fill="none"
            stroke="#1A4A6B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M45 42c0 6 10 6 10 12s-10 6-10 12"
            fill="none"
            stroke="#E8C982"
            strokeWidth="1.4"
            opacity="0.9"
          />
        </symbol>

        <symbol id="plate-dessert" viewBox="0 0 100 100">
          <use href="#plate-default" />
          <path
            d="M34 60c6-10 26-10 32 0"
            fill="none"
            stroke="#1A4A6B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M40 52c3-6 17-6 20 0"
            fill="none"
            stroke="#E8C982"
            strokeWidth="1.4"
            opacity="0.9"
            strokeLinecap="round"
          />
        </symbol>
      </defs>
    </svg>
  );
}

