#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import {RelayerStack} from "../lib/cdk-stack";

const app = new cdk.App();
new RelayerStack(app, "RelayerStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
