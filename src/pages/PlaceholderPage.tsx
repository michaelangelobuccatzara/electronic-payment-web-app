interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
        {title}
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        This page hasn't been designed yet.
      </p>
    </div>
  );
}