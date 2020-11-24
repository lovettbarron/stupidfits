import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

const calculateWinner = (matchid, matches, fix) => {
  const match = matches.find((m) => m.id === matchid);

  let results = [];
  for (let i in match.parents) {
    if (match.Fits.length > 0) {
      console.log(
        "Already a matchup here",
        match.id,
        match.Fits.map((f) => f.id)
      );
      continue;
    }

    const c = match.parents[i];
    const m = matches.find((f) => f.id === c.id);

    if (m.votes.length < 1) {
      if (m.Fits.length < 1) {
        console.log("Empty Parent at", m.id);
        fix(m.id);
        continue;
      }

      const rand = m.Fits[Math.floor(Math.random() * m.Fits.length)];
      console.log("RANDOM WINNER!", rand.id);
      results.push(rand.id);
    } else {
      const res = m.votes.reduce((store, curr) => {
        let exist = store.find((s) => s.id === curr.fit.id);
        if (!exist) {
          store.push({ id: curr.fit.id, val: 1 });
        } else {
          const index = store.indexOf(exist);
          store[index].val = Number(store[index].val) + 1;
        }
        return store;
      }, []);

      // This is superfluous, but the reduce
      //above is just incase I want to have
      // more complex results or check for tie
      const winner = res.reduce((store, cur) =>
        store.val > cur.val ? store : cur
      );
      console.log("CALCULATED WINNER!", winner.id);
      results.push(winner.id);
    }
  }

  return results;
};

export default async function handle(req, res) {
  if (req.method === "POST") {
    handlePOST(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });

  const id = req.query.id;
  console.log("battleid", req.query);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const battle = await prisma.battle.findOne({
    where: { id: Number(id) },
    include: {
      user: true,
    },
  });

  if (user.id !== battle.user.id) {
    res.json({});
    res.end();
    return {};
  }

  const matches = await prisma.battleMatchup.findMany({
    where: { battle: { id: Number(id) } },
    include: {
      Fits: {
        include: {
          media: {
            include: {
              layers: {
                include: {
                  item: {
                    include: { brand: true },
                  },
                  media: true,
                },
              },
            },
          },
          user: true,
          components: {
            include: {
              brand: true,
            },
          },
        },
      },
      parents: true,
      votes: {
        include: {
          fit: true,
          user: true,
        },
      },
    },
  });

  const upcoming = matches.filter((m) => m.round === battle.activeRound + 2);

  for (let i in upcoming) {
    // Note on the +2, ActiveROund is 0 start, round is 1 start.

    const match = upcoming[i];

    const fixfunc = async (brokenid) => {
      const fix = calculateWinner(brokenid, matches, fixfunc);
      const updatematch = await prisma.battleMatchup.update({
        where: {
          id: brokenid,
        },
        data: {
          Fits: {
            connect: fix.map((w) => ({ id: w })),
          },
        },
      });
    };

    const winners = calculateWinner(match.id, matches, fixfunc);

    console.log("Winner for", match.id, winners);

    const updatedmatch = await prisma.battleMatchup.update({
      where: {
        id: match.id,
      },
      data: {
        Fits: {
          connect: winners.map((w) => ({ id: w })),
        },
      },
    });
  }

  const updatedbattle = await prisma.battle.update({
    where: { id: Number(id) },
    data: {
      activeRound: battle.activeRound + 1,
    },
  });

  await prisma.$disconnect();
  res.json(updatedbattle);
}
