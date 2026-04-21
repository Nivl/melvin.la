import { Footer } from "#shared/components/layout/footer";
import { Section } from "#shared/components/layout/section";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Section className="mb-3 lg:mb-8">
        <Footer />
      </Section>
    </>
  );
}
