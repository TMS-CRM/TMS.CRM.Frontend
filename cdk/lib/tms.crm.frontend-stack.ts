import * as cdk from "aws-cdk-lib";
import {
  Stack,
  RemovalPolicy,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_s3_deployment as s3deploy,
  aws_certificatemanager as acm,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class TmsCrmFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The domain name for the frontend
    const paramTmsCrmFrontendDomain = new cdk.CfnParameter(this, 'TmsCrmFrontendDomain', {
      type: 'String',
      description: 'The domain name for the TMS CRM frontend',
    });

    const paramTmsCrmFrontendCertificateArn = new cdk.CfnParameter(this, 'TmsCrmFrontendCertificateArn', {
      type: 'String',
      description: 'The certificate ARN for the TMS CRM frontend',
    });

    // Load ACM cert from SSM
    const certificate = acm.Certificate.fromCertificateArn(this, "Certificate", paramTmsCrmFrontendCertificateArn.valueAsString);

    // S3 Bucket
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false,
    });

    // CloudFront origin with OAC
    const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket, {
      originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.LIST],
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [paramTmsCrmFrontendDomain.valueAsString],
      certificate,
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // Deploy site to S3 + invalidate CF cache
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Output
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
