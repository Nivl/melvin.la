import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Section } from '@/components/Section';
import { Tech } from '@/components/Tech';

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
        <Tech
          title={pages.backendOps.title}
          content={pages.backendOps.content}
          logos={pages.backendOps.logos}
        />
      </Section>

      <Section>
        <Tech
          title={pages.clientTech.title}
          content={pages.clientTech.content}
          logos={pages.clientTech.logos}
          inverted={true}
        />
      </Section>

      {/* <Section fullScreen={true}>
        <Contact
          email={pages.contact.email}
          linkedInHandle={pages.contact.linkedInHandle}
          githubHandle={pages.contact.githubHandle}
        />
      </Section> */}

      <Section>
        <Footer />
      </Section>
    </>
  );
}
