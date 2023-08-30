export function Section({
  children,
  fullScreen = false,
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
}) {
  return (
    <section
      className={`mx-auto my-0 mt-52
    ${
      fullScreen
        ? 'max-w-full'
        : // TODO(melvin): all width values are wrong besides 2xl
          'max-w-7xl'
    }`}
    >
      {children}
    </section>
  );
}
