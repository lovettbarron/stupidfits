import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import FitVote from "./FitVote";
import { Spinner } from "baseui/spinner";
import { Skeleton } from "baseui/skeleton";

const BattleMatch = ({ id, round, activeRound, Fits, parents, handler }) => {
  const [session, loading] = useSession();
  const [isOpen, setIsOpen] = useState(false);

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
            vote={activeRound === round}
            fit={fit.id}
            // selected={selected.find((s) => s === fit.id) ? true : false}
            // handler={handler}
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
          max-height: 300px;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .match {
          height: 45%;
          width: 100%;
          background-color: #f5f5f5;
          box-shadow: rgba(0, 0, 0, 0.3) 0 1px 3px;
          display: flex;
          flex-direction: row;
          transition: all ease 0.5s;
        }
      `}</style>
    </div>
  );
};

export default BattleMatch;
