const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
export default Button;