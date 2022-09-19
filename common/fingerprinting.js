import fp from "@fingerprintjs/fingerprintjs";
import { setCookie } from "cookies-next";

export const FINGERPRING_ID = "dca-cc-fp";

export const getFingerprint = async () => {
  const fpPromise = await fp.load();

  const { visitorId } = await fpPromise.get();

  setCookie(FINGERPRING_ID, visitorId, {
    secure: true,
    maxAge: 3600,
    sameSite: "lax",
  });

  return visitorId;
};
