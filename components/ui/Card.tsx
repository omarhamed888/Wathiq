
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ className, children, ...props }) => (
  <h3 className={`text-xl font-semibold text-slate-800 dark:text-slate-100 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);