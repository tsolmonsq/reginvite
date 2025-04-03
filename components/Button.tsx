interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost';
  }
  
  const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
    const base = 'rounded-lg px-4 py-2 font-semibold transition';
    const variants = {
      primary: 'bg-primary text-white border-2 border-primary hover:opacity-90',
      ghost: 'bg-transparent text-primary border-2 border-primary hover:bg-primary/0.1]',
    };
  
    return (
      <button
        className={`${base} ${variants[variant]} ${className ?? ''}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  