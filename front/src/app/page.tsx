import { About } from '@/components/About';
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
          resumeUrl={pages.about.resumeUrl}
          pictureUrl={pages.about.pictureUrl}
          linkedInUrl={pages.about.linkedInUrl}
        />
      </Section>
    </>
  );
}
