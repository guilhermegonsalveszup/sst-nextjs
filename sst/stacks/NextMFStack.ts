import { StackContext } from 'sst/constructs/FunctionalStack';
import { NextSite } from '../overrides/nextsite'

export function NextMFStack({ stack }: StackContext) {
  const site = new NextSite(stack, "site", {
    edge: true,
    timeout: 30,
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}