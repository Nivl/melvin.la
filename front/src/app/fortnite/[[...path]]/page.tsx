import { AccountTypes } from '../../../components/fortnite/Form';
import { Fortnite } from '../../../components/fortnite/Fortnite';

export default async function Home({
  params,
}: {
  params: { path?: string[] };
}) {
  return (
    <>
      <Fortnite
        providedName={params.path?.[0]}
        providedType={params.path?.[1] as AccountTypes | undefined}
      />
    </>
  );
}
