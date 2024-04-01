import './globals.css';

import { About } from '@/components/Home/About';
import { Contact } from '@/components/Home/Contact';
import { Footer } from '@/components/Home/Footer';
import { Header } from '@/components/Home/Header';
import { Section } from '@/components/Home/Section';
import { Tech } from '@/components/Home/Tech';
import { Pages } from '@/models';

export function Home({ pages }: { pages: Pages }) {
  return (
    <div id="home">
      <Section>
        <Header />
      </Section>

      <Section>
        <About
          title={pages.about.title}
          content={pages.about.content}
          cta={pages.about.cta}
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

      <Section fullScreen={true}>
        <Contact
          email={pages.contact.email}
          linkedInHandle={pages.contact.linkedInHandle}
          githubHandle={pages.contact.githubHandle}
        />
      </Section>

      <Section>
        <Footer />
      </Section>
    </div>
  );
}
