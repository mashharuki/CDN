import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as ssm from "aws-cdk-lib/aws-ssm";
import {Construct} from "constructs";
import path = require("path");

/**
 * Relayerに関するスタック
 */
export class RelayerStack extends cdk.Stack {
  // グローバル変数群
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSMから環境変数を取得する。
    const RELAYER_PRIVATE_KEY = ssm.StringParameter.valueFromLookup(
      this,
      "RELAYER_PRIVATE_KEY"
    );

    // Lambda関数を定義
    const lambdaFunction = new NodejsFunction(this, "RelayerLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/lambda/index.ts"),
      handler: "handler",
      bundling: {
        forceDockerBundling: true,
      },
      environment: {
        RELAYER_PRIVATE_KEY: RELAYER_PRIVATE_KEY,
      },
    });

    // API Gateway Rest APIを作成
    const api = new apigateway.RestApi(this, "RelayerPublicApi", {
      restApiName: "relayer",
      description: "This RelayerPublicApi serves my Lambda function.",
    });

    // Lambda Integration
    const postLambdaIntegration = new apigateway.LambdaIntegration(
      lambdaFunction,
      {
        requestTemplates: {
          "application/json": '{ "statusCode": "200" }',
        },
      }
    );

    // APIキーを作成
    const apiKey = api.addApiKey("ApiKey");

    // APIキーを使用するUsagePlanを作成
    const plan = api.addUsagePlan("UsagePlan", {
      name: "Easy",
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
    });

    // APIのリソースとメソッドを定義
    const items = api.root.addResource("relayer");
    const postMethod = items.addMethod("POST", postLambdaIntegration, {
      apiKeyRequired: true,
    });

    // UsagePlanにメソッドを追加
    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: postMethod,
          throttle: {
            rateLimit: 10,
            burstLimit: 2,
          },
        },
      ],
    });
    // UsagePlanにAPIキーを追加
    plan.addApiKey(apiKey);

    // 成果物
    new cdk.CfnOutput(this, "RelayerApiUrl", {
      value: api.url,
      description: "The URL of the API Gateway",
      exportName: "RelayerApiUrl",
    });

    new cdk.CfnOutput(this, "RelayerLambdaFunctionArn", {
      value: lambdaFunction.functionArn,
      description: "The ARN of the Lambda function",
      exportName: "RelayerLambdaFunctionArn",
    });
  }
}
