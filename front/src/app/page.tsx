import { About } from '@/components/About';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Section } from '@/components/Section';

import db from './db.json';

export default function Home() {
  const pages = db.pages;
  return (
    <>
      <Section>
        <Header />
      </Section>

      <Section>
        <About
          title={pages.about.title}
          content={pages.about.content}
          linkedInUrl={pages.about.linkedInUrl}
        />
      </Section>

      <Section>
        <Footer />
      </Section>
    </>
  );
}
