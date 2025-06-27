#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TmsCrmFrontendStack } from '../lib/tms.crm.frontend-stack.js';
import { TmsCrmFrontendCertificateStack } from '../lib/tms.crm.frontend.certificate-stack.js';

const app = new cdk.App();

new TmsCrmFrontendStack(app, 'TmsCrmFrontendStack', {});
new TmsCrmFrontendCertificateStack(app, 'TmsCrmFrontendCertificateStack', {});