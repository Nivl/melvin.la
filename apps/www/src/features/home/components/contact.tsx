"use client";

import { useOverlayState } from "@heroui/react";
import { Mail } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LuGithub as Github, LuLinkedin as Linkedin } from "react-icons/lu";

import { BoopableLink } from "#features/home/components/boopable-link";
import { Heading } from "#shared/components/layout/heading";

const LinkedInModal = dynamic(
  async () => {
    const mod = await import("./linked-in-modal");
    return mod.LinkedInModal;
  },
  { ssr: false },
);

const Map = dynamic(
  async () => {
    const mod = await import("./map");
    return mod.Map;
  },
  {
    loading: () => (
      <div
        data-testid="map-placeholder"
        className="h-200 w-full bg-surface-secondary"
        aria-hidden="true"
      />
    ),
    ssr: false,
  },
);

export const Contact = () => {
  const overlayState = useOverlayState({ defaultOpen: false });
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const mapSentinelRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  const t = useTranslations("home.contact");

  useEffect(() => {
    const el = mapSentinelRef.current;
    let observer: IntersectionObserver | undefined = undefined;

    if (el && !shouldLoadMap) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoadMap(true);
            observer?.disconnect();
          }
        },
        { rootMargin: "400px 0px" },
      );
      observer.observe(el);
    }

    return () => {
      observer?.disconnect();
    };
  }, [shouldLoadMap]);

  const contactInfos = [
    {
      className: "font-sans-latin",
      icon: <Mail className="inline-block" />,
      key: "Email",
      label: "jobs@melvin.la",
      link: "mailto:jobs@melvin.la",
    },
    {
      className: "hover:text-red-400 motion-safe:transition-colors duration-300 font-sans-latin",
      icon: <Linkedin className="inline-block" />,
      key: "LinkedIn",
      label: "in/melvinlaplanche",
      link: "https://linkedin.com/in/melvinlaplanche",
      onClick: (evt: React.MouseEvent<HTMLAnchorElement>) => {
        evt.preventDefault();
        setModalTitle(":(");
        setModalContent(t("linkedinModalContent"));
        overlayState.open();
      },
    },
    {
      className: "font-sans-latin",
      icon: <Github className="inline-block" />,
      key: "GitHub",
      label: "@Nivl",
      link: "https://github.com/Nivl",
    },
  ];

  return (
    <>
      <div className="mx-auto my-0 mt-16 mb-3 w-5/6 md:mb-10 lg:mt-52 lg:max-w-7xl">
        <Heading level={2}>{t("title")}</Heading>

        <div className="flex flex-col md:flex-row">
          {contactInfos.map(({ className, icon, label, link, onClick }) => (
            <span key={label} className="grow">
              <BoopableLink
                className={className}
                icon={icon}
                label={label}
                link={link}
                onClick={onClick}
              />
            </span>
          ))}
        </div>

        {overlayState.isOpen && (
          <LinkedInModal
            closeLabel={t("linkedinModalClose")}
            content={modalContent}
            state={overlayState}
            title={modalTitle}
          />
        )}
      </div>
      <div ref={mapSentinelRef}>
        {shouldLoadMap ? (
          <Map className="h-200 w-full" initialCenter={{ lat: 34.021_859_3, lng: -118.498_265 }} />
        ) : (
          <div
            data-testid="map-placeholder"
            className="h-200 w-full bg-surface-secondary"
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
};
