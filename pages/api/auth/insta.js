import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
const axios = require("axios");
const querystring = require("querystring");
const FormData = require("form-data");
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
    var data = new FormData();
    data.append("client_id", "325074402038126");
    data.append("client_secret", "75fc7af89421912dc3c4f11d182ffb32");
    data.append("grant_type", "authorization_code");
    data.append("redirect_uri", "https://stage.stupidfits.com/api/auth/insta");
    data.append(
      "code",
      "AQCuazNU_Fw54RsbY5j6VB2aeMAr6kwdii4v8PRSBxoxMwTuPgQhUR85szpBhNVtjVFDyUO0Q98P0ZM1_b_pg_566TeNvyz2SYnd-Soz9VAobKDTcobkKji-QYnrWoEzAZCOF49dI3LRzM6-rWpJmJ4slojoiCSdGLPPH1FqH0aXYIH5KMvjGpomf6wGdM_DhB7ufebSNhooCz68kJDk2Kh7yuaNRxZTZLA-OU6XUIL7SQ"
    );

    var config = {
      method: "post",
      url: "https://api.instagram.com/oauth/access_token",
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    // const form = new FormData();
    // form.append("client_id", this._appId);
    // form.append("client_secret", this._appSecret);
    // form.append('grant_type', 'authorization_code');
    // form.append("redirect_uri", this._redirectUri);
    // form.append("code", userCode.replace("#_", ""));

    // console.log("Token Request", `${INSTAGRAM_GRAPH_BASE_URL}/access_token`);

    // const config = {
    //   method: "post",
    //   url: `${INSTAGRAM_GRAPH_BASE_URL}/access_token`,
    //   headers: {
    //     ...form.getHeaders(),
    //   },
    //   data: form,
    // };
    // return axios(config).then((res) => res.data);
    // .post(`${INSTAGRAM_GRAPH_BASE_URL}/access_token`, form, {
    //   headers: {
    //     // "Content-Type": "multipart/form-data",
    //     "content-type": "application/x-www-form-urlencoded",
    //   },
    // })
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
    const token = await ig.retrieveToken(code);
    const long = await ig.retrieveLongLivedToken(token.access_token);
    console.log("Long Token", long.access_token);
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
