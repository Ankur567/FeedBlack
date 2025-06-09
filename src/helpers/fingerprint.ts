import FingerprintJS from "@fingerprintjs/fingerprintjs";

// Load and return the visitorId
export async function getFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}
