import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import { PostsInsightsFeed } from "instagram-private-api";
import cloudinary from "cloudinary";
import axios from "axios";

const prisma = new PrismaClient();
import { Instagram, Media } from "../../../lib/insta";

export default async function handle(req, res) {
  const id = req.query.id;
  const session = await getSession({ req });

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const requestData = {
    grant_type: "ig_refresh_token",
    access_token: user.instagramlong,
  };

  console.log(
    "Long Token Request",
    `https://graph.instagram.com/refresh_access_token?${querystring.stringify(
      requestData
    )}`
  );

  const refresh = await axios
    .get(
      `${INSTAGRAM_GRAPH_BASE_URL}/access_token?${querystring.stringify(
        requestData
      )}`
    )
    .catch(function (error) {
      console.log(error);
    });

  const t = new Date();

  const media = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      instagramlong: refresh.access_token,
      instagramrefresh: t.setSeconds(t.getSeconds() + refresh.expires_in),
    },
  });
  res.json(media);
}
