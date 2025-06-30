import { Footer } from '#components/layout/Footer';
import { Section } from '#components/layout/Section';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Section className="mb-3 lg:mb-8">
        <Footer />
      </Section>
    </>
  );
}
