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
  const [activeRound, setActiveRound] = useState(0);

  const ref = useRef();

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
    return () => {};
  }, [matches]);

  // Based on this
  // https://codepen.io/b3b00/pen/YoZYmv

  return (
    <div className="container">
      <div className="bracket">
        {isLoading && (
          <Spinner size={96} overrides={{ Svg: { borderTopColor: "#fff" } }} />
        )}
        {rounds > 0 &&
          Array.from(Array(rounds).keys()).map((r) => (
            <section className="round quarterfinals">
              <div className="winners">
                {matches &&
                  matches
                    .filter((m) => m.round === r + 1)
                    .map((match) => (
                      <BattleMatch
                        key={match.id}
                        activeRound={activeRound}
                        {...match}
                        handler={handler}
                      />
                    ))}
              </div>
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
          transition: all ease 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Battle;
