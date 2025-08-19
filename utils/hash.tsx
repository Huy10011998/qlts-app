import * as Crypto from "expo-crypto";

export async function md5Hash(input: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.MD5,
    input
  );
}
