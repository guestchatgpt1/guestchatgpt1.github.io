interface SectionHeadingProps {
  id?: string;
  label?: string;
  title: string;
  description?: string;
  className?: string;
}

const SectionHeading = ({ id, label, title, description, className = "" }: SectionHeadingProps) => {
  return (
    <div className={`text-center max-w-3xl mx-auto mb-16 ${className}`}>
      {label && (
        <span className="font-display text-xs tracking-[0.3em] uppercase text-primary mb-4 block">
          {label}
        </span>
      )}
      <h2
        id={id}
        className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 gradient-text leading-tight"
      >
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
