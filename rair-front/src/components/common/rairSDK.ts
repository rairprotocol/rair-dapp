import { RairSDK } from "@rair-protocol/sdk";

const settings = {
  serverURL: window.location.origin,
};

export const rairSDK = new RairSDK(settings);
