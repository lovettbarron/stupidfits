if (!req.body.imgs || req.body.imgs.length < 1) {
  res.status(400).json({ error: "No media refs" });
  return null;
}

const session = await getSession({ req });
console.log("Create Fit", session.user.email, req.body);

const user = await prisma.user.findOne({
  where: {
    email: session.user.email,
  },
});

const review = await prisma.review.create({
  data: {
    user: {
      connect: {
        id: session.user.id,
      },
    },
    published: false,
    title: req.body.title,
  },
});
res.json(review);
