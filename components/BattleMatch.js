import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import { useSession } from "next-auth/client";
import FitThumb from "./FitThumb";
import { Spinner } from "baseui/spinner";

const BattleMatch = ({ id, round, Fits, parentshandler }) => {
  const router = useRouter();
  const [session, loading] = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef();

  useEffect(() => {
    if (type) {
      setIsOpen(true);
      handler(false);
    }
    return () => {};
  }, [media, type, session]);

  return (
    <div className="modal">
      {Fits.map((fit) => (
        <FitThumb
          key={fit.id}
          {...fit}
          fit={fit.id}
          selected={selected.find((s) => s === fit.id) ? true : false}
          handler={handler}
        />
      ))}
      <style jsx>{`
        .page {
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .save {
          width: 100%;
        }

        canvas {
          overflow: hidden;
          border: 1px solid #ffffff;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
};

export default BattleMatch;
