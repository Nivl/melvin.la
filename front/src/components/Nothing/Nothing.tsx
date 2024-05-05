'use client';

import { useEffect, useState } from 'react';

import { Footer } from '../Home/Footer';
import { Section } from '../Home/Section';

const failedMessages = [
  'Good job, you failed at doing nothing…',
  "You can't even do nothing right…",
  'How does it feel to suck at doing nothing?',
  "If you can't do nothing, maybe go do something somewhere else?",
];

export const Nothing = () => {
  const [gameState, setGameState] = useState<'lost' | 'waiting' | 'started'>(
    'waiting',
  );

  useEffect(() => {
    let callback = () => setGameState('started');
    let events = ['keydown', 'click'];
    if (gameState === 'started') {
      callback = () => setGameState('lost');
      events = [
        'compositionstart',
        'keydown',
        'click',
        'contextmenu',
        'mousemove',
        'touchstart',
        'resize',
        'scroll',
        'wheel',
      ];
    }

    events.forEach(e => window.addEventListener(e, callback));
    return () => events.forEach(e => window.removeEventListener(e, callback));
  }, [gameState]);

  return (
    <>
      <Section>
        <h1 className="mb-5 pb-5 text-center text-3xl font-black uppercase">
          Nothing
        </h1>
      </Section>

      <Section className="text-center">
        <p>
          {gameState === 'lost' ? (
            <>
              <span>
                {
                  failedMessages[
                    Math.floor(Math.random() * failedMessages.length)
                  ]
                }
              </span>

              <span className="hidden lg:block">
                Press any key to try again
              </span>

              <span className="block lg:hidden">Touch to try again</span>
            </>
          ) : gameState === 'started' ? (
            <>...</>
          ) : (
            <>
              <span>To win, just do nothing</span>
              <span className="hidden lg:block">Press any key to start</span>
              <span className="block lg:hidden">Touch to start</span>
            </>
          )}
        </p>
      </Section>

      <Section className="mb-3 lg:mb-8">
        <Footer />
      </Section>
    </>
  );
};
