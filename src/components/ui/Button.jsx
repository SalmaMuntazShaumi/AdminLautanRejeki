// components/common/Button.jsx

export default function Button({
  children,
  className = '',
  ...props
}) {
  return (
    <button
      {...props}
      className={`button-primary ${className}`}
    >
      {children}
    </button>
  );
}