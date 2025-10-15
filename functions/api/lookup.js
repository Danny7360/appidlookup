// functions/api/lookup.js

export async function onRequest(context) {
  // 从请求对象中直接获取 URL 对象，这是更稳健的方式
  const url = new URL(context.request.url);
  const { searchParams } = url;
  
  const bundleId = searchParams.get('bundleId');
  const storeId = searchParams.get('id');

  // 构建苹果 API URL 的逻辑保持不变
  let appleApiUrl = 'https://itunes.apple.com/lookup?';
  if (bundleId) {
    appleApiUrl += `bundleId=${encodeURIComponent(bundleId)}`;
  } else if (storeId) {
    appleApiUrl += `id=${encodeURIComponent(storeId)}`;
  } else {
    // 如果没有参数，返回一个客户端错误
    return new Response(JSON.stringify({ error: 'Missing bundleId or id parameter' }), {
      status: 400, // 400 Bad Request
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 从服务器到服务器的请求
    const response = await fetch(appleApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      }
    });    
    // 检查苹果服务器的响应是否成功
    if (!response.ok) {
      // 如果苹果服务器返回错误，将错误信息透传给前端
      return new Response(JSON.stringify({ error: `Apple API returned status ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    // 将从苹果获取的数据直接返回给前端
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // 如果 fetch 本身失败（例如网络问题），返回一个 500 错误
    return new Response(JSON.stringify({ error: 'Failed to fetch from Apple API' }), {
      status: 500, // 500 Internal Server Error
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
