#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TmsCrmFrontendStack } from '../lib/tms.crm.frontend-stack.js';
import { TmsCrmFrontendCertificateStack } from '../lib/tms.crm.frontend.certificate-stack.js';

const app = new cdk.App();
const stack = app.node.tryGetContext("stack");

if (!stack || stack === "TmsCrmFrontendCertificateStack") {
  new TmsCrmFrontendCertificateStack(app, "TmsCrmFrontendCertificateStack");
}

if (!stack || stack === "TmsCrmFrontendStack") {
  new TmsCrmFrontendStack(app, "TmsCrmFrontendStack");
}