import { useTranslations } from 'next-intl';

import { About } from '#components/Home/About';
import { Contact } from '#components/Home/Contact';
import { Header } from '#components/Home/Header';
import { Tech } from '#components/Home/Tech';
import { Footer } from '#components/layout/Footer';
import { Section } from '#components/layout/Section';
import { Sections } from '#models';

export function Home({ sections }: { sections: Sections }) {
  const t = useTranslations('home');

  return (
    <div id="home-page">
      <Section>
        <Header />
      </Section>

      <Section>
        <About />
      </Section>

      <Section>
        <Tech
          title={t('tech.backend.title')}
          content={[t('tech.backend.content')]}
          logos={sections.backendOps.logos}
        />
      </Section>

      <Section>
        <Tech
          title={t('tech.client.title')}
          content={[t('tech.client.content1'), t('tech.client.content2')]}
          logos={sections.clientTech.logos}
          inverted={true}
        />
      </Section>

      <Section fullScreen={true}>
        <Contact />
      </Section>

      <div className="dark:bg-background bg-[#63B7FF] pb-4">
        <Section className="mt-0 pt-16 sm:mt-0 sm:pt-40 xl:mt-0 xl:pt-52">
          <Footer />
        </Section>
      </div>
    </div>
  );
}
