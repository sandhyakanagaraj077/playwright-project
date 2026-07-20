export async function executeRequest(request, method, url, payload = null) {

  const startTime = Date.now();

  let response;

  if (method === "GET") {

    response = await request.get(url);

  }

  if (method === "POST") {

    response = payload

      ? await request.post(url, { data: payload })

      : await request.post(url);

  }

  if (method === "PUT") {

    response = payload

      ? await request.put(url, { data: payload })

      : await request.put(url);

  }

  if (method === "DELETE") {

    response = await request.delete(url);

  }

  const responseTime = Date.now() - startTime;

  const status = response.status();

  let body;

  try {

    body = await response.json();

  } catch {

    body = {};

  }

  return { response, body, status, responseTime };

}
 