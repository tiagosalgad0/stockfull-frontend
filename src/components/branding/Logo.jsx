import './Logo.css'

export default function Logo({ size = 'md' }) {
  return (
    <div className={`logo logo--${size}`}>
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="1em" height="1em">
          <rect width="32" height="32" rx="7" fill="var(--color-primary)" />
          <path
            d="M9 20.5 13.5 13l4 5.5L22.5 10"
            stroke="white"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="logo__text">
        Stock<strong>Full</strong>
      </span>
    </div>
  )
}
