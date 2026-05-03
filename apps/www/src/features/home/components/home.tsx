import { useTranslations } from "next-intl";

import { About } from "#features/home/components/about";
import { Contact } from "#features/home/components/contact";
import { Header } from "#features/home/components/header";
import { Skills } from "#features/home/components/skills";
import { Tech } from "#features/home/components/tech";
import { Sections } from "#features/home/models";
import { Footer } from "#shared/components/layout/footer";
import { Section } from "#shared/components/layout/section";

export const Home = ({ sections }: { sections: Sections }) => {
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
          inverted
        />
      </Section>

      <Section>
        <Skills />
      </Section>

      <Section fullScreen>
        <Contact />
      </Section>

      <div className="bg-[#63B7FF] pb-4 dark:bg-background">
        <Section className="mt-0 pt-16 sm:mt-0 sm:pt-40 xl:mt-0 xl:pt-52">
          <Footer />
        </Section>
      </div>
    </div>
  );
};
