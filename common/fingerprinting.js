import fp from "@fingerprintjs/fingerprintjs";
import { setCookie } from "cookies-next";

export const FINGERPRING_ID = "dca-cc-fp";

export const getFingerprint = async () => {
  const fpPromise = await fp.load();

  const { visitorId } = await fpPromise.get();

  return visitorId;
};

export const setFingerprintCookie = async () => {
  const fingerprint = await getFingerprint();

  setCookie(FINGERPRING_ID, fingerprint, {
    secure: true,
    maxAge: 3600 * 24,
    sameSite: "lax",
  });
};
