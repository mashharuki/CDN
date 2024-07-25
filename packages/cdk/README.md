# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

- bootstrap

  ```bash
  yarn cdk bootstrap
  ```

- CDK スタックデプロイ

  ```bash
  yarn cdk deploy '*'
  ```

  以下のようになれば OK!

  ```bash
   ✅  RelayerStack

  ✨  Deployment time: 47.5s

  Outputs:
  RelayerStack.RelayerApiUrl = https://xp7hlofsr5.execute-api.ap-northeast-1.amazonaws.com/prod/
  RelayerStack.RelayerLambdaFunctionArn = arn:aws:lambda:ap-northeast-1:796032104877:function:RelayerStack-RelayerLambdaFunction73C9AE35-XUouseTYgE8P
  RelayerStack.RelayerPublicApiEndpoint444ECE91 = https://xp7hlofsr5.execute-api.ap-northeast-1.amazonaws.com/prod/
  Stack ARN:
  arn:aws:cloudformation:ap-northeast-1:796032104877:stack/RelayerStack/fd4e5931-466b-11ef-b811-0a7f1d45a6bf

  ✨  Total time: 49.78s
  ```

- CDK スタック削除

  ```bash
  yarn cdk destroy '*'
  ```

## Relayer API の叩き方

```bash
curl -X POST "https://[固有値].execute-api.ap-northeast-1.amazonaws.com/prod/relayer" -H "Content-Type: application/json" -H "x-api-key: [固有値]" -d @packages/cdk/data/request.json
```
