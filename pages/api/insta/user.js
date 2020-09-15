import userInstagram from "user-instagram";

export default async function handle(req, res) {
  const { id } = req.query;
  console.log("Fetching instagram", id);
  const user = await userInstagram(id);
  // console.log("Got user:", user.username);
  res.json(user);
}
