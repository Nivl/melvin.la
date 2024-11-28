import { EditPost } from '#components/Admin/blog/EditPost';

export default function Home({ params }: { params: { id: string } }) {
  return <EditPost id={params.id} />;
}
