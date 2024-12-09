import { use } from 'react';

import { AccountTypes } from '#components/fortnite/Form';
import { Fortnite } from '#components/fortnite/Fortnite';

export default function Home(props: { params: Promise<{ path?: string[] }> }) {
  const { path } = use(props.params);
  return (
    <>
      <Fortnite
        providedName={path?.[0]}
        providedType={path?.[1] as AccountTypes | undefined}
      />
    </>
  );
}
