"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LuGithub as Github, LuLinkedin as Linkedin } from "react-icons/lu";

import { BoopableLink } from "#features/home/components/BoopableLink";
import { Heading } from "#shared/components/layout/Heading";

import { Map } from "./Map";

export const Contact = () => {
  const overlayState = useOverlayState({ defaultOpen: false });
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const t = useTranslations("home.contact");

  const contactInfos = [
    {
      icon: <Mail className="inline-block" />,
      key: "Email",
      link: "mailto:jobs@melvin.la",
      label: "jobs@melvin.la",
      className: "font-sans-latin",
    },
    {
      icon: <Linkedin className="inline-block" />,
      key: "LinkedIn",
      link: "https://linkedin.com/in/melvinlaplanche",
      label: "in/melvinlaplanche",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setModalTitle(":(");
        setModalContent(t("linkedinModalContent"));
        overlayState.open();
      },
      className: "hover:text-red-400 motion-safe:transition-colors duration-300 font-sans-latin",
    },
    {
      icon: <Github className="inline-block" />,
      key: "GitHub",
      link: "https://github.com/Nivl",
      label: "@Nivl",
      className: "font-sans-latin",
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

        <Modal state={overlayState}>
          <Modal.Backdrop isDismissable isKeyboardDismissDisabled>
            <Modal.Container>
              <Modal.Dialog>
                <Modal.Header className="flex flex-col gap-1">{modalTitle}</Modal.Header>
                <Modal.Body>
                  <p>{modalContent}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onPress={() => {
                      overlayState.close();
                    }}
                  >
                    {t("linkedinModalClose")}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
      <Map className="h-200 w-full" initialCenter={{ lat: 34.021_859_3, lng: -118.498_265 }} />
    </>
  );
};
