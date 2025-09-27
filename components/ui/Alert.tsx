
import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const variantClasses = {
  default: 'bg-slate-100 border-slate-200 text-slate-800',
  destructive: 'bg-red-50 border-red-200 text-red-800',
};

export const Alert: React.FC<AlertProps> = ({ className, variant = 'default', ...props }) => (
  <div
    role="alert"
    className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7 ${variantClasses[variant]} ${className}`}
    {...props}
  />
);

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ className, ...props }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
);
