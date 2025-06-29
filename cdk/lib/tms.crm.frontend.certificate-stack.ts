import * as cdk from 'aws-cdk-lib';
import { Stack, aws_certificatemanager as acm } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

export class TmsCrmFrontendCertificateStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The domain name for the frontend
    const paramTmsCrmFrontendDomain = new cdk.CfnParameter(this, 'TmsCrmFrontendDomain', {
      type: 'String',
      description: 'The domain name for the TMS CRM frontend',
    });

    // Create the certificate in us-east-1
    const certificate = new acm.Certificate(this, 'TmsFrontendCertificate', {
      domainName: paramTmsCrmFrontendDomain.valueAsString,
      validation: acm.CertificateValidation.fromDns(),
    });

    // Output the ARN for use in the frontend stack
    new cdk.CfnOutput(this, 'CertificateArnOutput', {
      value: certificate.certificateArn,
      exportName: 'TmsFrontendCertArn',
    });
  }
}
