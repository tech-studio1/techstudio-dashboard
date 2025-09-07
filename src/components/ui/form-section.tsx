import React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  delay = 0,
}) => {
  return (
    <div
      className={cn(
        "section-fade-in mb-8 rounded-xl p-6 border bg-card shadow-sm",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="space-y-2 mb-4">
        <div className="inline-flex items-center">
          <span className="h-6 w-1 bg-primary rounded-full mr-2" />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default FormSection;
