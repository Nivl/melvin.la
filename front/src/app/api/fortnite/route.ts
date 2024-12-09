export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get('name');
  if (!name) {
    return Response.json({ error: 'name is missing' }, { status: 400 });
  }

  let accountType = searchParams.get('accountType');
  if (!accountType) {
    accountType = 'epic';
  }

  let timeWindow = searchParams.get('timeWindow');
  if (!timeWindow) {
    timeWindow = 'lifetime';
  }

  const res = await fetch(
    `https://fortnite-api.com/v2/stats/br/v2?name=${name}&accountType=${accountType}&timeWindow=${timeWindow}`,
    {
      headers: {
        Authorization: process.env.FORTNITE_API_KEY!,
      },
    },
  );

  try {
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (_) {
    return Response.json(
      { error: 'something went wrong' },
      { status: res.status },
    );
  }
}
