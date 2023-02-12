import { canUserProceed, storeFingerprint } from "../../../server/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { setCookie } from "cookies-next";
import { FINGERPRING_ID } from "../../../common/fingerprinting";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const fingerprint = req.query.fingerprint;

  // Store fingerprint
  if (req.method === "POST") {
    setCookie(FINGERPRING_ID, fingerprint, {
      secure: true,
      maxAge: 3600 * 24,
      sameSite: "lax",
    });

    await storeFingerprint(fingerprint);
  }

  // Check if fingerprint can proceed
  const canProceed = await canUserProceed(fingerprint, session);

  res.status(200).json(canProceed);
}

export default handler;
