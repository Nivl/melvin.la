import { use } from 'react';

import { EditPost } from '#components/Admin/blog/EditPost';

export default function Home(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  return <EditPost id={id} />;
}
