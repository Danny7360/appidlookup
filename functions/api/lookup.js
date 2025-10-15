// functions/api/lookup.js

export async function onRequest(context) {
  // Get the search params from the request URL
  const { searchParams } = new URL(context.request.url);
  const bundleId = searchParams.get('bundleId');
  const storeId = searchParams.get('id');

  // Build the target Apple API URL
  let appleApiUrl = 'https://itunes.apple.com/lookup?';
  if (bundleId) {
    appleApiUrl += `bundleId=${bundleId}`;
  } else if (storeId) {
    appleApiUrl += `id=${storeId}`;
  } else {
    return new Response(JSON.stringify({ error: 'Missing bundleId or id parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Fetch data from the Apple API (server-to-server call)
  const response = await fetch(appleApiUrl);
  const data = await response.json();

  // Create a new response to send back to the browser
  const newResponse = new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Add the crucial CORS header to allow your frontend to read the response
      'Access-Control-Allow-Origin': '*',
    },
  });

  return newResponse;
}