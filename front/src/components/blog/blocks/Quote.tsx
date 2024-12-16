import { twMerge } from 'tailwind-merge';

export const Quote = ({
  quote,
  author,
  className,
}: {
  quote: string;
  author: string;
  className?: string;
}) => {
  return (
    <blockquote
      className={twMerge(
        `relative border-s-4 ps-4 dark:border-neutral-700 sm:ps-6 ${className}`,
      )}
    >
      <p className="text-gray-800 dark:text-white sm:text-xl">
        <em>{quote}</em>
      </p>

      <footer className="mt-6">
        <div className="text-base font-semibold text-gray-800 dark:text-neutral-400">
          {author}
        </div>
      </footer>
    </blockquote>
  );
};
