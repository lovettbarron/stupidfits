import React, { useEffect, useState, useRef } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import BattleMatch from "./BattleMatch";
import { Spinner } from "baseui/spinner";
import { Button } from "baseui/button";
import FitMini from "./FitMini";
import { Skeleton } from "baseui/skeleton";

const Battle = (props) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [rounds, setRounds] = useState(0);
  const [activeRound, setActiveRound] = useState(props.activeRound || 0);

  const ref = useRef();

  const nextRound = async () => {
    // setActiveRound(activeRound + 1);
    setIsLoading(true);
    console.log("Next Round for", props.id);
    try {
      // const body = { fit: fitid };
      const res = await fetch(
        `${process.env.HOST}/api/battle/matches/next/${props.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      console.log("Voted!", data);
      setActiveRound(data.activeRound);
      setIsLoading(false);
      // cb(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      // cb(false);
    }
  };

  const fetchMatches = async (first) => {
    setIsLoading(true);
    const b = await fetch(
      `${process.env.HOST}/api/battle/matches/${props.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
      {session && session.user.id === props.user.id && (
        <Button
          onClick={nextRound}
          isLoading={isLoading}
          disabled={activeRound === rounds}
        >
          Next Round
        </Button>
      )}
      <br />
      {isLoading && (
        <Spinner size={96} overrides={{ Svg: { borderTopColor: "#fff" } }} />
      )}
      <div className="bracket">
        {rounds > 0 &&
          Array.from(Array(rounds).keys()).map((r) => (
            <section
              className={`round ${activeRound === r && `active`} ${
                activeRound < r && `nomobile`
              } `}
            >
              <h3>Round {r + 1}</h3>
              {activeRound === r && <h4>Currently Voting!</h4>}
              {matches &&
                matches
                  .filter((m) => m.round === r + 1)
                  .map((match) => (
                    <BattleMatch
                      key={match.id}
                      round={r}
                      totalRounds={rounds.length}
                      activeRound={activeRound}
                      {...match}
                      handler={props.handler}
                    />
                  ))}
            </section>
          ))}
        <section
          className={`round ${activeRound === rounds && ` active`}${
            activeRound < rounds && ` nomobile`
          }`}
        >
          <h3>Winner!</h3>
          {activeRound === rounds && <h4>Tournament Closed</h4>}
          <div className="winnerBox">
            {(props.winners &&
              props.winners.map((f) => (
                <FitMini key={f.id} {...f} fit={f.id} />
              ))) || <Skeleton height="300px" width="200px" />}
          </div>
        </section>
      </div>
      <style jsx>{`
        .container {
          display: block;
          overflow: scroll;
          width: 100%;
          height: auto;
        }

        .winnerBox {
          width: 100%;
          margin: auto;
          min-width: 300px;

          height: auto;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          // align-items: center;
          align-items: top;
          padding: 0.5rem;
          // border: 1px solid #2b2b2b;
          // border-radius: 5px;
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
          .container {
            overflow: scroll;
            width: 100%;
            height: auto;
          }

          .nomobile {
            display: none;
          }

          .bracket {
            flex-direction: column-reverse;
            height: auto;
          }

          .round {
            flex-wrap: wrap;
            height: auto;
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default Battle;
