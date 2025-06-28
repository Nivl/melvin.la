import './globals.css';

import { About } from '#components/Home/About';
import { Contact } from '#components/Home/Contact';
import { Header } from '#components/Home/Header';
import { Tech } from '#components/Home/Tech';
import { Footer } from '#components/layout/Footer';
import { Section } from '#components/layout/Section';
import { Pages } from '#models';

export function Home({ pages }: { pages: Pages }) {
  return (
    <div id="home-page">
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

      <div className="bg-[#63B7FF] pb-4 dark:bg-background">
        <Section className="mt-0 pt-16 sm:mt-0 sm:pt-40 xl:mt-0 xl:pt-52">
          <Footer />
        </Section>
      </div>
    </div>
  );
}
