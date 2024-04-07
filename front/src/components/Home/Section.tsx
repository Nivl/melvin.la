import { twMerge } from 'tailwind-merge';

export function Section({
  children,
  fullScreen = false,
  className = '',
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
  className?: string;
}) {
  return (
    <section
      className={twMerge(`my-0 mt-16 sm:mt-40 xl:mt-52
    ${
      fullScreen
        ? `mx-auto max-w-full ${className}`
        : `mx-6 max-w-screen-sm sm:mx-auto lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-7xl ${className}`
    }`)}
    >
      {children}
    </section>
  );
}
