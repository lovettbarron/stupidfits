import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import axios from "axios";
import querystring from "querystring";
import FormData from "form-data";
import request from "request";
import qs from "qs";
const prisma = new PrismaClient();

const INSTAGRAM_OAUTH_BASE_URL = "https://api.instagram.com/oauth";
const INSTAGRAM_GRAPH_BASE_URL = "https://graph.instagram.com";

class InstagramBasicDisplayApi {
  constructor(config) {
    this._appId = config.appId;
    this._redirectUri = config.redirectUri;
    this._appSecret = config.appSecret;

    this._authorizationUrl = `${INSTAGRAM_OAUTH_BASE_URL}/authorize?${querystring.stringify(
      {
        client_id: this._appId,
        redirect_uri: this._redirectUri,
        scope: "user_profile,user_media",
        response_type: "code",
      }
    )}`;
  }

  get authorizationUrl() {
    return this._authorizationUrl;
  }

  retrieveToken(userCode) {
    console.log(String(this._redirectUri));

    var data = qs.stringify({
      client_id: String(this._appId),
      client_secret: String(this._appSecret),
      grant_type: "authorization_code",
      redirect_uri: "https://stage.stupidfits.com/api/auth/insta", //String(this._redirectUri),
      code: String(userCode.replace("#_", "")),
    });
    var config = {
      method: "post",
      url: `${INSTAGRAM_GRAPH_BASE_URL}/access_token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    return axios(config)
      .then((res) => res.data)
      .catch(function (error) {
        console.log(error);
      });
  }

  retrieveLongLivedToken(accessToken) {
    const requestData = {
      grant_type: "ig_exchange_token",
      client_secret: this._appSecret,
      access_token: accessToken,
    };

    console.log(
      "Long Token Request",
      `${INSTAGRAM_GRAPH_BASE_URL}/access_token?${querystring.stringify(
        requestData
      )}`
    );

    return axios
      .get(
        `${INSTAGRAM_GRAPH_BASE_URL}/access_token?${querystring.stringify(
          requestData
        )}`
      )
      .then((res) => res.data);
  }

  retrieveUserNode(
    accessToken,
    fields = "id,username,account_type,media_count,media"
  ) {
    const requestData = {
      fields,
      access_token: accessToken,
    };

    return axios
      .get(
        `${INSTAGRAM_GRAPH_BASE_URL}/me?${querystring.stringify(requestData)}`
      )
      .then((res) => res.data);
  }

  retrieveUserMedia(
    accessToken,
    limit = 20,
    fields = "caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username"
  ) {
    const requestData = {
      fields,
      limit,
      access_token: accessToken,
    };

    return axios
      .get(
        `${INSTAGRAM_GRAPH_BASE_URL}/me/media?${querystring.stringify(
          requestData
        )}`
      )
      .then((res) => res.data);
  }

  retrieveMediaData(
    accessToken,
    mediaId,
    fields = "caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username"
  ) {
    const requestData = {
      fields,
      access_token: accessToken,
    };

    return axios.get(
      `${INSTAGRAM_GRAPH_BASE_URL}/${mediaId}?${querystring.stringify(
        requestData
      )}`
    );
  }
}

export default async function handle(req, res) {
  let ig;
  const session = await getSession({ req });
  // Generate the client
  try {
    ig = await new InstagramBasicDisplayApi({
      appId: process.env.INSTAGRAM_CLIENT_ID,
      redirectUri: `${process.env.HOST}/api/auth/insta`,
      appSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    });
  } catch (err) {
    console.log(err);
  }

  // Are we consuming a response from the initial query?
  if (req.query.code) {
    const code = req.query.code; // Auth code
      try {
    const token = await ig.retrieveToken(code);
    console.log(token);
  } catch (err) {
    console.log("Error retrieving Temp Token",err);
  }
  try {
    if (!token) res.json("error fetching token");
    const long = await ig.retrieveLongLivedToken(token.access_token);
    console.log("Long Token", long.access_token);
  } catch (err) {
    console.log("Error retrieving Long Token",err);
  }

    try {
      const instaUpdate = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          instagramlong: long.access_token,
        },
      });

      res.writeHead(302, {
        Location: "/feed",
      });
      res.end();
    } catch (err) {
      res.json("error getting token", err);
    }
  }
}
