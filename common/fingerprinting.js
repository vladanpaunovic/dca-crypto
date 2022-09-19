import fp from "@fingerprintjs/fingerprintjs";

export const FINGERPRING_ID = "dca-cc-fp";

export const getFingerprint = async () => {
  const fpPromise = await fp.load();

  const { visitorId } = await fpPromise.get();

  return visitorId;
};
