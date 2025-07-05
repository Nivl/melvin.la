import './globals.css';

import { About } from '#components/Home/About';
import { Contact } from '#components/Home/Contact';
import { Header } from '#components/Home/Header';
import { Tech } from '#components/Home/Tech';
import { Footer } from '#components/layout/Footer';
import { Section } from '#components/layout/Section';
import { Sections } from '#models';

export function Home({ sections }: { sections: Sections }) {
  return (
    <div id="home-page">
      <Section>
        <Header />
      </Section>

      <Section>
        <About
          title={sections.about.title}
          content={sections.about.content}
          cta={sections.about.cta}
        />
      </Section>

      <Section>
        <Tech
          title={sections.backendOps.title}
          content={sections.backendOps.content}
          logos={sections.backendOps.logos}
        />
      </Section>

      <Section>
        <Tech
          title={sections.clientTech.title}
          content={sections.clientTech.content}
          logos={sections.clientTech.logos}
          inverted={true}
        />
      </Section>

      <Section fullScreen={true}>
        <Contact
          email={sections.contact.email}
          linkedInHandle={sections.contact.linkedInHandle}
          githubHandle={sections.contact.githubHandle}
        />
      </Section>

      <div className="bg-[#63B7FF] pb-4 dark:bg-background">
        <Section className="mt-0 pt-16 sm:mt-0 sm:pt-40 xl:mt-0 xl:pt-52">
          <Footer />
        </Section>
      </div>
    </div>
  );
}
