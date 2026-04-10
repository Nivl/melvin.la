import { useTranslations } from "next-intl";

import { About } from "#features/home/components/About";
import { Contact } from "#features/home/components/Contact";
import { Header } from "#features/home/components/Header";
import { Skills } from "#features/home/components/Skills";
import { Tech } from "#features/home/components/Tech";
import { Sections } from "#features/home/models.ts";
import { Footer } from "#shared/components/layout/Footer";
import { Section } from "#shared/components/layout/Section";

export function Home({ sections }: { sections: Sections }) {
  const t = useTranslations("home");

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
          title={t("tech.backend.title")}
          content={[t("tech.backend.content")]}
          logos={sections.backendOps.logos}
        />
      </Section>

      <Section>
        <Tech
          title={t("tech.client.title")}
          content={[t("tech.client.content1"), t("tech.client.content2")]}
          logos={sections.clientTech.logos}
          inverted={true}
        />
      </Section>

      <Section>
        <Skills />
      </Section>

      <Section fullScreen={true}>
        <Contact />
      </Section>

      <div className="bg-[#63B7FF] pb-4 dark:bg-background">
        <Section className="mt-0 pt-16 sm:mt-0 sm:pt-40 xl:mt-0 xl:pt-52">
          <Footer />
        </Section>
      </div>
    </div>
  );
}
