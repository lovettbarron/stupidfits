import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Drawer, SIZE, ANCHOR } from "baseui/drawer";
import { Button } from "baseui/button";
import { useSession, signin, signout } from "next-auth/client";

const Nav = (props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isActive = (pathname) => {
    router.pathname === pathname;
  };
  const toggleTrueFalse = () => setIsOpen(!isOpen);
  const [session, loading] = useSession();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setIsLoading(true);
    });

    router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
      setIsOpen(false);
      console.log("Close nav");
    });
    return () => {};
  }, []);

  return (
    <>
      <div className="navigation">
        <div className="desktop">
          <Link href="/">
            <h1>Stupid Fits</h1>
          </Link>
          {(!session && (
            <a className="topauth" onClick={signin}>
              <img src={`/img/login.png`} />
            </a>
          )) || (
            <Link href="/feed">
              <a>
                <Button>Add Fit</Button>
              </a>
            </Link>
          )}
          {(session && (
            <Link href="/">
              <a className="bold" data-active={isActive("/")}>
                Feed
              </a>
            </Link>
          )) || (
            <Link href="/global">
              <a className="bold" data-active={isActive("/global")}>
                Fits
              </a>
            </Link>
          )}
          <Link href="/review">
            <a className="bold" data-active={isActive("/review")}>
              Review
            </a>
          </Link>
          <Link href="/brand">
            <a className="bold" data-active={isActive("/brand")}>
              Brands
            </a>
          </Link>
        </div>

        <a className="main" onClick={toggleTrueFalse}>
          <img src="/img/menu.png" />
        </a>
      </div>
      <Drawer
        isOpen={isOpen}
        autoFocus
        onClose={() => setIsOpen(false)}
        size={SIZE.full}
        onEscapeKeyDown={() => setIsOpen(false)}
        animate={true}
        anchor={ANCHOR.right}
      >
        {(session && (
          <div className="nav">
            <Link href="/">
              <a className="bold" data-active={isActive("/")}>
                Feed
              </a>
            </Link>

            <Link href="/feed">
              <a data-active={isActive("/feed")}>
                <Button>Add Fit</Button>
              </a>
            </Link>
            <Link href="/closet">
              <a data-active={isActive("/closet")}>Closet</a>
            </Link>
            <Link href="/brand">
              <a data-active={isActive("/brand")}>Brands</a>
            </Link>
            <Link href="/review">
              <a data-active={isActive("/review")}>Reviews</a>
            </Link>
            <Link href="/global">
              <a data-active={isActive("/global")}>Others' Fits</a>
            </Link>
            <Link href="/me">
              <a data-active={isActive("/me")}>Setting</a>
            </Link>
            <hr />

            <a onClick={signout}>Sign out</a>
          </div>
        )) || (
          <div className="nav">
            <h3>You're not logged in.</h3>
            <hr />
            <a className="auth" onClick={signin}>
              <img src={`/img/login.png`} />
            </a>
            <Link href="/global">
              <a data-active={isActive("/global")}>Public Fits</a>
            </Link>
            <Link href="/brand">
              <a data-active={isActive("/brand")}>Brands</a>
            </Link>
          </div>
        )}

        <footer>
          <ul>
            <li>
              <a href="https://reddit.com/r/stupidfits" target="_blank">
                /r/stupidfits
              </a>
            </li>
            <li>
              <a href="https://instagram.com/stupidfits" target="_blank">
                Instagram
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <Link href="/wtf">
                <a>WTF is this?</a>
              </Link>
            </li>
            <li>
              <Link href="/privacy">
                <a>Privacy</a>
              </Link>
            </li>
            <li>
              <Link href="/tos">
                <a>Terms</a>
              </Link>
            </li>
            <li>
              <Link href="/cookie">
                <a>Cookies</a>
              </Link>
            </li>
          </ul>
        </footer>
      </Drawer>
      <style jsx>{`
        .navigation {
          display: flex;
          width: 100%;
          padding: 0 1rem;
          justify-content: space-between;
          align-items: center;
          margin-left: auto;
          position: sticky;
          cursor: pointer;
          top: 1rem;
          left: 1rem;
          z-index: 120;
        }

        .desktop {
          display: flex;
          justify-self: flex-start;
          justify-content: flex-start;
          align-items: center;
        }

        @media screen and (max-width: 800px) {
          .navigation {
            justify-content: flex-end;
          }

          .desktop {
            display: none !important;
          }
        }

        .desktop > h1 {
          margin-right: 2rem;
        }

        .desktop > a {
          margin: 0 1rem;
          font-size: 16px;
          text-decoration: none;
        }

        .desktop > a:hover {
          text-decoration: underline;
        }

        a.topauth > img {
          max-width: 200px;
          margin: 0 2rem 0 0;
        }

        a.main > img {
          width: 2rem;
        }

        .navigation a {
        }

        .auth img {
          max-width: 20rem;
          transition: all 0.4s;
        }
        .auth img:hover {
          -webkit-filter: invert(1);
          filter: invert(1);
          background: black;
        }

        footer ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin: 0 auto 2rem 0;
          padding: 0;
        }

        footer a {
          font-size: 1.5rem !important;
          margin: 0 1rem;
        }

        footer li {
          margin: 0;
          list-style: none;
        }

        h1:hover {
          animation: shake 0.5s;
          animation-iteration-count: infinite;
        }

        .nav a {
          display: block;
          line-height: 4rem;
          margin: 3rem auto;
          font-size: 3rem;
          align-items: center;
          color: #ffffff;
          text-decoration: underline;
        }

        @keyframes shake {
          0% {
            transform: translate(1px, 1px) rotate(0deg);
          }
          10% {
            transform: translate(-1px, -2px) rotate(-1deg);
          }
          20% {
            transform: translate(-3px, 0px) rotate(1deg);
          }
          30% {
            transform: translate(3px, 2px) rotate(0deg);
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg);
          }
          50% {
            transform: translate(-1px, 2px) rotate(-1deg);
          }
          60% {
            transform: translate(-3px, 1px) rotate(0deg);
          }
          70% {
            transform: translate(3px, 1px) rotate(-1deg);
          }
          80% {
            transform: translate(-1px, -1px) rotate(1deg);
          }
          90% {
            transform: translate(1px, 2px) rotate(0deg);
          }
          100% {
            transform: translate(1px, -2px) rotate(-1deg);
          }
        }
      `}</style>
    </>
  );
};
export default Nav;
