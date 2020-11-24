import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import Image from "./Image";
import { Button, KIND, SIZE } from "baseui/button";
import TriangleRight from "baseui/icon/triangle-right";
import { Skeleton } from "baseui/skeleton";
import { Cap } from "./Anatomy";

const FitMini = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [fit, setFit] = useState(props.fit || false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(props.selected ? true : false);
  const [disabled, setDisabled] = useState(props.disabled || false);

  useEffect(() => {
    setDisabled(props.disabled);
    return () => {};
  }, [props]);

  return (
    <div>
      <div
        className={`fitbox ${
          (!disabled && selected && "selected") ||
          (disabled && !selected && "selected")
        }`}
      >
        <div className="mediawrap">
          {props.empty ? (
            <Skeleton height="300px" width="200px" />
          ) : (
            <Image
              fit={props.id}
              components={props.components}
              url={props.imageUrl}
              media={props.media}
              user={props.user}
              edit={false}
              nolayer={true}
              mini={true}
            />
          )}
        </div>
        {props.id && !props.empty && (
          <div className="control">
            <div className="header">
              {(selected + !disabled && (
                <Button
                  size={SIZE.mini}
                  kind={KIND.secondary}
                  isLoading={isLoading}
                  // disabled={selected}
                  onClick={() => {
                    setIsLoading(true);
                    if (selected) {
                      props.deleteHandler(props.id, (del) => {
                        del && setSelected(false); // : setSelected(true);
                        setIsLoading(false);
                      });
                    } else {
                      props.handler(props.id, (added) => {
                        added && setSelected(true); // : setSelected(false);
                        setIsLoading(false);
                      });
                    }
                  }}
                >
                  {selected ? "Remove" : "Add Fit"}
                </Button>
              )) ||
                null}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .fitbox {
          margin: 0;
          background: #2b2b2b;
          border-radius: 0 0 5px 5px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          max-width: 150px;
          height: 150px;
          overflow: hidden;
          position: relative;
          margin: 0.25rem;
        }

        .fitbox.selected > .mediawrap {
          opacity: 0.2;
        }

        .control {
          position: absolute;
          z-index: 10;
          bottom: 0;
          padding-top: 1rem;
          width: 100%;
          left: 0;
          right: 0;
          height: 60px;
          max-height: 60px;
          background: transparent;
        }

        .active {
          position: absolute;
          right: 0;
          top: 0;
          transition: transform 0.4s;
        }

        button {
          padding: 5px;
          margin: 5px;
        }

        .canvasholder {
          margin: 0 auto;
        }

        .mediawrap {
          max-width: 200px;
          height: 150px;
          padding: 0;
          margin: 0;
          width: 100%;
          opacity: 1;
          transition: opacity 0.4s;
        }

        .header {
          width: 100%;
          margin: 0 auto;
          text-align: center;
        }

        .header h3 {
          margin: 0;
          text-align: center !important
          ;
        }

        .components {
          width: 50%;
          overflow: auto;
        }

        .links {
          font-size: 0.8rem;
          text-align: center;
        }

        .captions {
          text-align: left;
          font-size: 0.8rem;
        }

        .btns {
          display: flex;
          justify-content: center;
        }

        .header h3 {
          text-align: left;
        }
        @media screen and (max-width: 800px) {
          .mediawrap {
            width: 100%;
          }
          .btns {
            justify-content: center;
          }
          .components {
            width: 100%;
          }
        }

        .description {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          padding: 1rem 2rem;
          align-items: center;
        }

        .components {
          font-size: 1rem;
          height: 100%;
        }

        .des {
          padding: 0.5rem;
          font-size: 1.2rem;
          border: 1px solid #151515;
          border-width: 2px 0 0 0;
          text-align: center;
        }

        img {
          width: 100%;
          max-width: 20rem;
        }

        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          display: inline-block;
          color: #ffffff;
          text-decoration: underline;
        }

        .left a[data-active="true"] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
};

export default FitMini;
