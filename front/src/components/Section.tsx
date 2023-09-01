export function Section({
  children,
  fullScreen = false,
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
}) {
  return (
    <section
      className={`my-0 mt-16 sm:mt-40 xl:mt-52
    ${
      fullScreen
        ? 'mx-auto max-w-full'
        : 'mx-6 max-w-screen-sm sm:mx-auto sm:max-w-screen-sm lg:max-w-screen-md xl:max-w-7xl'
    }`}
    >
      {children}
    </section>
  );
}
