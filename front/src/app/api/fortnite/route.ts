export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get('name');
  if (!name) {
    return Response.json({ error: 'name is missing' }, { status: 400 });
  }

  const accountType = searchParams.get('accountType') ?? 'epic';
  const timeWindow = searchParams.get('timeWindow') ?? 'lifetime';

  const res = await fetch(
    `https://fortnite-api.com/v2/stats/br/v2?name=${name}&accountType=${accountType}&timeWindow=${timeWindow}`,
    {
      headers: {
        Authorization: process.env.FORTNITE_API_KEY ?? '',
      },
    },
  );

  try {
    const data = (await res.json()) as unknown;
    return Response.json(data, { status: res.status });
  } catch (_) {
    return Response.json(
      { error: 'something went wrong' },
      { status: res.status },
    );
  }
}
