import { PrismaClient, BattleType } from "@prisma/client";
import { getSession, session } from "next-auth/client";
var _uuid = require("uuid");
import generator from "tournament-generator";

const prisma = new PrismaClient();

// Round Int
// fits, array ids
// prevMatch array ids
// battle obj
const newMatch = (round, fits, prevMatches, battle, id) => {
  // BattleMatchup

  console.log(id, round, prevMatches);

  return {
    id: id,
    Fits:
      fits && Array.isArray(fits)
        ? {
            connect: fits.map((f) => ({
              id: f,
            })),
          }
        : undefined,
    round: Number(round),
    parents: Array.isArray(prevMatches)
      ? {
          connect: prevMatches.map((p) => ({
            id: p,
          })),
        }
      : undefined,
    votes: undefined,
    battle: {
      connect: {
        id: battle.id,
      },
    },
  };
};

const setParentMatches = (step, matches) => {
  if (step < 2) return [];
  // Get matches for current step
  const current = matches.filter((m) => {
    return m.round === step;
  });
  // Get Unaccounted Previous matches
  const prev = matches
    .filter((m) => {
      return m.round === step - 1;
    })
    .filter((m) => {
      return (current.length > 1 && current.find((t) => t.id !== m.id)) || true;
    });

  console.log("Parent", step, prev);

  // Grab two matches from the previous unmatched
  if (prev.length > 1) return prev.slice(0, 2).map((p) => p.id);
  // Grab just the one
  else if (prev.length === 1) return prev.slice(0, 1).map((p) => p.id);
  // Return null if there isn't anything
  else return [];
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
    data: {
      startDate: new Date(Date.now()),
      endDate: new Date(
        Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10
      ),
      rules: "",
      type: BattleType.POPULAR,
      user: {
        connect: { id: user.id },
      },
      // judges: null,
      collection: {
        connect: {
          id: collection.id,
        },
      },
      // BattleMatchup: matches,
      // tags: null,
    },
  });

  // Calculate Matches w/ library
  const { data: games } = generator(
    collection.fits.map((f) => ({
      id: f.id,
      name: f.user.username + "" + String(f.id),
    })),
    { type: "simple-cup" }
  );

  console.log("Games", games);

  // Calculate tota number of rounds
  // Rounding up to account for uneven
  const totalRounds = Math.ceil(Math.log2(collection.fits.length));

  console.log("Total Rounds", totalRounds);

  const matches = [];

  for (let step = 1; step <= totalRounds; step++) {
    const gamesInRound = games.filter((g) => Number(g.round) === step);

    if (gamesInRound.length > 0) {
      // If Pre-calculated
      for (let i in gamesInRound) {
        const g = gamesInRound[i];

        if (
          g.customData &&
          g.customData.constructor === Object &&
          Object.keys(g.customData).length > 0
        ) {
          // If has a connection from generated?
          // Not 100% sure abotu this
          matches.push(
            newMatch(
              step,
              g.awayTeam !== "TO_BE_DEFINED"
                ? [g.awayTeam.id, g.homeTeam.id]
                : null,
              [g.customData.awayTeam, g.customData.homeTeam],
              battle,
              g.id
            )
          );
        } else {
          matches.push(
            newMatch(step, [g.awayTeam.id, g.homeTeam.id], null, battle, g.id)
          );
        }
      }
    } else {
      // Not pre-calculated, i.e. start on 2 or 3

      const matchesInRound =
        matches.filter((m) => m.round === step - 1).length / 2;
      console.log("Matches in round", step, matchesInRound);
      for (let mat = 0; mat < matchesInRound; mat++) {
        const parentMatches = setParentMatches(step, matches);
        if (parentMatches.length < 1) {
          console.log("Something wrong with calc");
          continue;
        } else {
          matches.push(
            newMatch(
              step,
              null,
              setParentMatches(step, matches),
              battle,
              (0, _uuid.v4)()
            )
          );
        }
      }
    }
  }
  // Set Match objects
  console.log("All Calculated Matches", JSON.stringify(matches));

  // Save Battle
  for (let i in matches) {
    const m = matches[i];

    const mat = await prisma.battleMatchup.create({
      data: m,
    });
    console.log("Saved Match", mat);
  }

  res.json(battle);
}
