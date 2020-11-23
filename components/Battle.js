import React, { useEffect, useState, useRef } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import BattleMatch from "./BattleMatch";
import { Spinner } from "baseui/spinner";

const Battle = ({ id, handler }) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [rounds, setRounds] = useState(0);
  const [activeRound, setActiveRound] = useState(1);

  const ref = useRef();

  const nextRound = async () => {
    setActiveRound(activeRound + 1);
  };

  const fetchMatches = async (first) => {
    setIsLoading(true);
    const b = await fetch(`${process.env.HOST}/api/battle/matches/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let it;
    if (first) {
      it = await b.json();
      setMatches(it);
      setRounds(Math.ceil(Math.log2(it.length)));
      setIsLoading(false);
    }
    try {
      it = await b.json();
      setMatches(it);
      setRounds(Math.ceil(Math.log2(it.length)));
      setIsLoading(false);
    } catch (e) {
      console.log("error:", e.message);
    }
  };

  useEffect(() => {
    if (matches.length < 1) fetchMatches(true);
    else fetchMatches(false);
    return () => {};
  }, [matches, activeRound]);

  // Based on this
  // https://codepen.io/b3b00/pen/YoZYmv

  return (
    <div className="container">
      <button onClick={nextRound}>Next Round</button>
      <div className="bracket">
        {isLoading && (
          <Spinner size={96} overrides={{ Svg: { borderTopColor: "#fff" } }} />
        )}
        {rounds > 0 &&
          Array.from(Array(rounds).keys()).map((r) => (
            <section className={`round ${activeRound === r + 1 && `active`}`}>
              <h3>Round {r + 1}</h3>
              {activeRound === r + 1 && <h4>Currently Voting!</h4>}
              {matches &&
                matches
                  .filter((m) => m.round === r + 1)
                  .map((match) => (
                    <BattleMatch
                      key={match.id}
                      round={r + 1}
                      activeRound={activeRound}
                      {...match}
                      handler={handler}
                    />
                  ))}
            </section>
          ))}
      </div>
      <style jsx>{`
        .container {
        }

        .bracket {
          display: flex;
          flex-direction: row;
          height: 90%;
          width: 100%;
        }

        .round {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 100%;
          width: 100%;
          flex-grow: 1;
          border-radius: 5px;
          transition: all ease 0.5s;
        }

        .round.active {
          background: #2b2b2b;
        }

        h3 {
          margin-bottom: 0;
        }

        h4 {
          margin: 0;
          padding: 0;
        }

        @media screen and (max-width: 800px) {
          .bracket {
            flex-direction: column;
          }

          .round {
            flex-wrap: wrap;
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default Battle;
