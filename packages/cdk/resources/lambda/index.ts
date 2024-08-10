import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {requestRelayer} from "./lib/relayer";

/**
 * ハンドラー
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // リクエストのボディを取得
  const requestBody = JSON.parse(event.body || "{}");

  // meta txを送信するメソッド実行する
  const result = await requestRelayer(requestBody);

  let response;

  // レスポンスの構築
  if (result != null) {
    response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "send meta tx success.",
        txHash: result,
      }),
    };
  } else {
    response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: "send meta tx failed.",
      }),
    };
  }

  console.log("response:", response);

  return response;
};
