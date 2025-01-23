import { Card, CardBody } from '@heroui/react';

import { Footer } from '#components/Home/Footer';
import { Section } from '#components/Home/Section';
import { Melvin } from '#components/icons/Melvin';

export const Layout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Section className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center pb-5">
          <Melvin className="mb-3 w-12 fill-neutral-700 drop-shadow-lg dark:fill-foreground" />
          <p className="text-xl font-medium">Welcome</p>
          <p className="text-small text-default-500">{title}</p>
        </div>

        <Card className="w-full max-w-sm">
          <CardBody className="px-8 py-6">{children}</CardBody>
        </Card>
      </Section>

      <Section className="mb-3 lg:mb-8">
        <Footer />
      </Section>
    </>
  );
};
