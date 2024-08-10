import { BASE_API_URL } from "~~/utils/constants";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * requestRelayer API
 * @param requestData
 */
export async function POST(requestData: any) {
  console.log("request:", requestData?.request);

  if (requestData?.request === undefined) {
    return new Response("Request has no request", {
      status: 503,
    });
  }

  // AWS 上に展開したサーバーレスAPIを呼び出すように実装を変更する予定
  const response = await fetch(`${BASE_API_URL}/relayer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY!,
    },
    body: JSON.stringify({
      request: requestData.request,
    }),
  });

  console.log("response:", response);

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();

  console.log("responseData:", data);

  return {
    status: 200,
    body: data,
  } as any;
}
