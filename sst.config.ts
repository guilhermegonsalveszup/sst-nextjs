import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";
import path from "path";
import { SSTConfig } from "sst";
import { NextjsSite, NextjsSiteProps,Stack } from "sst/constructs";
import { EdgeFunction, EdgeFunctionProps } from "sst/constructs/EdgeFunction";

// class EdgeFunc extends EdgeFunction{
//   _scope: Construct;
//   constructor(_scope: Construct, _id: string, _props: EdgeFunctionProps) {
//     super(_scope, _id, _props);
//     console.log('CONSTRUTOR EDGE FUNC CLASS')
//     this._scope = _props.scopeOverride || this;
//   }
// }

class NextSite extends NextjsSite {

  constructor(_scope: Construct, _id: string, _props?: NextjsSiteProps){
    super(_scope, _id, _props);
    console.log('CONSTRUCAO: NEXT SITE')
  }

  protected override initBuildConfig() {
    console.log('JUST FOR OVERRIDE EXAMPLE!!')
    return {
        typesPath: ".",
        serverBuildOutputFile: ".open-next/server-function/index.mjs",
        clientBuildOutputDir: ".open-next/assets",
        clientBuildVersionedSubDir: "_next",
        clientBuildS3KeyPrefix: "_assets",
        prerenderedBuildOutputDir: ".open-next/cache",
        prerenderedBuildS3KeyPrefix: "_cache",
        warmerFunctionAssetPath: path.join(this.props.path, ".open-next/warmer-function"),
    };
  }

  protected override createFunctionForEdge() {
    const { runtime, timeout, memorySize, bind, permissions, environment } = this.props;
    console.log('CREATE FUNCTION FOR EDGE')
    return new EdgeFunction(this, "ServerFunction", {
        bundle: path.join(this.props.path, ".open-next", "server-function"),
        handler: "index.handler",
        runtime,
        timeout,
        memorySize,
        bind,
        permissions,
        environment: {
            ...environment,
            CACHE_BUCKET_NAME: this.bucket.bucketName,
            CACHE_BUCKET_KEY_PREFIX: "_cache",
            CACHE_BUCKET_REGION: Stack.of(this).region,
        },
    });
  }

}

export default {
  config(_input) {
    return {
      name: "sst-testing-2",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextSite(stack, "site",{
        edge: true,
        timeout: 30,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
