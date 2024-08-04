import { SSTConfig } from "sst";

import { NextMFStack } from './sst/stacks/NextMFStack'

export default {
  config(_input) {
    return {
      name: "sst-sleeping-test",
      region: "us-east-1",
    };
  },

  stacks(app) {
    app.stack(NextMFStack);
  },
} satisfies SSTConfig;
