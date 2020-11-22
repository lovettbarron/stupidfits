import { PrismaClient, BattleType } from "@prisma/client";
import { getSession, session } from "next-auth/client";

import generator from "tournament-generator";

const prisma = new PrismaClient();

// Round Int
// fits, array ids
// prevMatch array ids
// battle obj
const newMatch = (round, fits, prevMatches, battle, tempid) => {
  // BattleMatchup

  return {
    battle: {
      connect: {
        id: battle.id,
      },
    },
    fits: { connect: fits.map((f) => f.id) },
    round: Number(round),
    parents: {
      set: prevMatches.map((m) => {
        id: m.id;
      }),
    },
    votes: null,
    _tempid: tempid,
  };
};

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  console.log("Generate tournament", req.body);

  // Call Collection
  const collection = await prisma.collection.findOne({
    where: {
      id: req.body.collection,
    },
    include: {
      fits: {
        include: {
          user: true,
        },
      },
    },
  });

  const battle = await prisma.battle.create({
    startDate: "TODO",
    endDate: "TODO",
    rules: "",
    type: BattleType.POPULAR,
    user: {
      connect: { id: user.id },
    },
    judges: null,
    collection: {
      connect: {
        id: collection.id,
      },
    },
    tags: null,
  });

  const { data: games } = generator(
    collection.fits.map((f) => ({
      id: f.id,
      name: f.user.username + "" + String(f.id),
    })),
    { type: "simple-cup" }
  );

  console.log("Games", games);
  // Calculate Matches

  const totalRounds = Math.ceil(Math.log2(collection.fits.length));

  console.log("Total Rounds", totalRounds);

  const matches = [];

  for (let step = 1; step <= totalRounds; step++) {
    const gamesInRound = games.filter((g) => Number(g.round) === step);

    if (gamesInRound) {
      for (let i in gamesInRound) {
        const g = gamesInRound[i];

        if (g.customData) {
          // If has a connection from generated?
          newMatch(
            step,
            [g.awayTeam.id, g.homeTeam.id],
            [g.customData.awayTeam.id, g.customData.homeTeam.id],
            battle,
            g.id
          );
        } else {
          // First or second round w/ no connection

          newMatch(step, [g.awayTeam.id, g.homeTeam.id], null, battle, g.id);
        }
      }
    } else {
    }

    //round, fits, prevMatches, battle
    newMatch(step);
  }
  // Set Match objects

  // Save Battle

  res.json([]);
}
