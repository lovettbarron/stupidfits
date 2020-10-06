import userInstagram from "user-instagram";

export default async function handle(req, res) {
  const { id } = req.query;
  console.log("Fetching instagram", id);
  const user = await userInstagram(id);
  res.json(user);
}
