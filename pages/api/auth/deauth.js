import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const base64decode = (data) => {
  while (data.length % 4 !== 0) {
    data += "=";
  }
  data = data.replace(/-/g, "+").replace(/_/g, "/");
  return new Buffer(data, "base64").toString("utf-8");
};

const parseSignedRequest = (signedRequest, secret) => {
  const encoded_data = signed_request.split(".", 2);
  // decode the data
  const sig = encoded_data[0];
  const json = base64decode(encoded_data[1]);
  const data = JSON.parse(json);
  if (!data.algorithm || data.algorithm.toUpperCase() != "HMAC-SHA256") {
    throw Error(
      "Unknown algorithm: " + data.algorithm + ". Expected HMAC-SHA256"
    );
  }
  const expected_sig = crypto
    .createHmac("sha256", secret)
    .update(encoded_data[1])
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace("=", "");
  if (sig !== expected_sig) {
    throw Error("Invalid signature: " + sig + ". Expected " + expected_sig);
  }
  return data;
};

export default async function handle(req, res) {
  // TODO
  // Decode Request
  // Search for user based off of request
  // Delete Instagram auth tokens
  res
    .status(200)
    .json({ url: "https://stupidfits.com/u/", confirmation_code: "<code>" });
}
