'use client';

import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LuGithub as Github, LuLinkedin as Linkedin } from 'react-icons/lu';
import { twMerge } from 'tailwind-merge';

import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';

import { Heading } from '../layout/Heading';
import { Map } from './Map';

export const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const contactInfos = [
    {
      icon: <Mail className="inline-block" />,
      key: 'Email',
      link: 'mailto:jobs@melvin.la',
      label: 'jobs@melvin.la',
    },
    {
      icon: <Linkedin className="inline-block" />,
      key: 'LinkedIn',
      link: 'https://linkedin.com/in/melvinlaplanche',
      label: 'in/melvinlaplanche',
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsModalOpen(true);
        setModalTitle(':(');
        setModalContent(
          'Too many shady companies scraped my LinkedIn data to create profiles on their websites and sell everything to recruiters. I made the decision to remove my LinkedIn account.',
        );
      },
      className:
        'hover:text-red-400 motion-safe:transition-colors duration-300',
    },
    {
      icon: <Github className="inline-block" />,
      key: 'GitHub',
      link: 'https://github.com/Nivl',
      label: '@Nivl',
    },
  ];

  return (
    <>
      <div className="mx-auto my-0 mt-16 mb-3 w-5/6 md:mb-10 lg:mt-52 lg:max-w-7xl">
        <Heading level={2}> Get In Touch </Heading>

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

        <Modal
          isDismissable={true}
          isKeyboardDismissDisabled={true}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        >
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {modalTitle}
                </ModalHeader>
                <ModalBody>
                  <p>{modalContent}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <Map
        className="h-[800px] w-full"
        initialCenter={{ lat: 34.021_859_3, lng: -118.498_265 }}
      />
    </>
  );
};

const BoopableLink = ({
  icon,
  label,
  link,
  className,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  link: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const [isBooped, setIsBooped] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsBooped(false);
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [isBooped]);

  return (
    <a
      onMouseEnter={() => {
        if (reduceMotion) {
          return;
        }
        setIsBooped(true);
      }}
      onClick={onClick}
      href={link}
      className={twMerge(
        'flex items-center justify-center gap-4 border-none',
        className,
      )}
    >
      <span
        className={`cls-boop-animation origin-bottom motion-safe:transition-all ${isBooped ? 'rotate-15' : 'rotate-0'}`}
      >
        {icon}
      </span>{' '}
      {label}
    </a>
  );
};
