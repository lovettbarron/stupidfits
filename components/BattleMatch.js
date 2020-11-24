import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import FitVote from "./FitVote";
import FitMini from "./FitMini";
import { Spinner } from "baseui/spinner";
import { Skeleton } from "baseui/skeleton";

const BattleMatch = ({
  id,
  round,
  activeRound,
  totalRounds,
  Fits,
  votes,
  winner,
  parents,
  handler,
}) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [vote, setVote] = useState(null);
  const [allVotes, setAllVotes] = useState(votes);

  const addVote = async (fitid, cb) => {
    console.log("Adding fit", id);
    try {
      const body = { fit: fitid };
      const res = await fetch(`${process.env.HOST}/api/battle/matches/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Voted!", data);
      if (data) setAllVotes((v) => [data, ...v]);
      setVote(data.fit.id);
      cb(true);
    } catch (error) {
      console.error(error);
      cb(false);
    }
  };

  useEffect(() => {
    return () => {};
  }, [vote, allVotes, activeRound]);

  if (winner) {
    if (votes.length < 1) {
      return (
        <div className="match">
          <h4>No votes, no winner!</h4>
          <FitVote key={0} votes={false} empty={true} />
        </div>
      );
    } else {
      const res = votes.reduce((store, curr) => {
        let exist = store.find((s) => s.id === curr.fit.id);
        if (!exist) {
          store.push({ id: curr.fit.id, val: 1 });
        } else {
          const index = store.indexOf(exist);
          store[index].val = Number(store[index].val) + 1;
        }
        return store;
      }, []);

      console.log(res);
      const win =
        res.length > 0 &&
        res.reduce((store, cur) => (store.val > cur.val ? store : cur));

      const f = Fits.find((f) => f.id === win.id);

      return (
        <div className="">
          <div className="match">
            <FitMini key={f.id} {...f} fit={f.id} />
          </div>
        </div>
      );
    }
  } else
    return (
      <div className="matchups">
        {Fits.length === 0 && (
          <>
            <div className="match">
              <FitVote key={0} votes={false} empty={true} />
            </div>
            <div className="match">
              <FitVote key={0} votes={false} empty={true} />
            </div>
          </>
        )}
        {Fits.length === 1 && activeRound < totalRounds - 1 && (
          <>
            <div className="match">
              <FitVote
                key={Fits[0].id}
                active={activeRound === round}
                votes={allVotes}
                {...Fits[0]}
                fit={Fits[0].id}
              />
            </div>
            <div className="match">
              <FitVote key={0} votes={false} empty={true} />
            </div>
          </>
        )}
        {Fits.map((fit) => {
          return (
            <div className="match">
              <FitVote
                key={fit.id}
                {...fit}
                active={activeRound + 1 === round}
                done={activeRound + 1 > round}
                votes={allVotes}
                vote={vote}
                fit={fit.id}
                selected={
                  allVotes.find((s) => s.fit.id === fit.id) ? true : false
                }
                handler={addVote}
              />
            </div>
          );
        })}

        <div className="connector">
          <div className="merger" />
          <div className="line" />
        </div>
        <style jsx>{`
          .matchups {
            width: 100%;
            margin: auto;
            min-width: 300px;
            min-height: 180px;
            max-height: 300px;
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            // align-items: center;
            align-items: top;
            padding: 0.5rem;
            // border: 1px solid #2b2b2b;
            // border-radius: 5px;
          }

          .match {
            height: auto;
            width: 100%;
            box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
            display: flex;
            flex-direction: row;
            transition: all ease 0.5s;
          }

          @media screen and (max-width: 800px) {
            .matchups {
              max-height: auto;
              height: auto;
              min-width: 300px;
            }
            .match {
              height: 100%;
            }
          }
        `}</style>
      </div>
    );
};

export default BattleMatch;
