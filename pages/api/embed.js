import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const embed = req.query.embed;
  const userid = req.query.username;
  const fitid = Number(req.query.id);

  let fit;
  let user;

  if (fitid) {
    fit = await prisma.fit.findOne({
      where: {
        id: fitid,
      },
      include: {
        user: true,
        media: true,
      },
    });
    user = fit.user;
  } else if (userid) {
    user = await prisma.user.findOne({
      where: {
        username: userid,
      },
      include: {
        fit: {
          include: {
            media: true,
          },
        },
      },
    });

    fit =
      Array.isArray(user.fit) &&
      user.fit.length > 0 &&
      user.fit[user.fit.length - 1];
  }

  const title = userid
    ? `${user.username}'s Fits on Stupid Fits`
    : `${user.username}'s fit on Stupid Fits`;

  const thumb = fit.media.cloudinary;

  res.json({
    version: "1.0",
    type: "photo",
    width: 600,
    height: 320,
    title: title,
    url: embed,
    author_name: user.username,
    author_url: `https://stupidfits.com/u/${user.username}`,
    provider_name: "Stupid Fits",
    provider_url: "http://stupidfits.com/",
    thumbnail_width: 600,
    thumbnail_height: 320,
    thumbnail_url: thumb
      ? `https://res.cloudinary.com/stupidsystems/image/upload/b_rgb:151515,c_lpad,h_320,w_600/${thumb}.png`
      : `https://stupidfits.com/img/appiconwide.png`,
  });
}
