"use client";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export function FormSection({ title, children, className = "", required = false }: FormSectionProps) {
  return (
    <div className={`bg-gray-900/50 p-5 rounded-lg border border-gray-800 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        {title}
        {required && <span className="text-red-500 text-sm">*</span>}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
