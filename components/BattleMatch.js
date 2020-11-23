import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import FitVote from "./FitVote";
import { Spinner } from "baseui/spinner";
import { Skeleton } from "baseui/skeleton";

const BattleMatch = ({
  id,
  round,
  activeRound,
  Fits,
  votes,
  parents,
  handler,
}) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [vote, setVote] = useState(null);

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
      setVote(data.fit.id);
      cb(true);
    } catch (error) {
      console.error(error);
      cb(false);
    }
  };

  return (
    <div className="matchups">
      {Fits.length < 1 && (
        <>
          <div className="match">
            <FitVote key={0} vote={false} empty={true} />
          </div>
          <div className="match">
            <FitVote key={0} vote={false} empty={true} />
          </div>
        </>
      )}
      {Fits.length === 1 && (
        <>
          <div className="match">
            <FitVote
              key={fit[0].id}
              vote={activeRound === round}
              {...fit[0]}
              fit={fit[0].id}
            />
          </div>
          <div className="match">
            <FitVote key={0} vote={false} empty={true} />
          </div>
        </>
      )}
      {Fits.map((fit) => (
        <div className="match">
          <FitVote
            key={fit.id}
            {...fit}
            active={activeRound === round}
            votes={votes}
            fit={fit.id}
            selected={votes.find((s) => s.fit.id === fit.id) ? true : false}
            handler={addVote}
          />
        </div>
      ))}

      <div className="connector">
        <div className="merger" />
        <div className="line" />
      </div>
      <style jsx>{`
        .matchups {
          width: 100%;
          margin: auto;
          min-width: 300px;
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
