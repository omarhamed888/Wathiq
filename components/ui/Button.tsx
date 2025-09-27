import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const variantClasses = {
  default: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  destructive: 'bg-red-100 text-red-900 hover:bg-red-200',
  outline: 'border border-slate-300 bg-transparent hover:bg-slate-100 text-black',
  ghost: 'hover:bg-slate-100 text-black',
  link: 'underline-offset-4 hover:underline text-black',
};

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    // FIX: Add `asChild` prop to allow rendering a child component (e.g., `Link`) with button styles.
    const finalClassName = `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if (asChild) {
      const child = React.Children.only(children);

      if (!React.isValidElement(child)) {
        return null;
      }
      
      return React.cloneElement(child, {
        ref,
        ...props,
        className: [finalClassName, child.props.className].filter(Boolean).join(' '),
      });
    }

    return (
      <button
        className={finalClassName}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);