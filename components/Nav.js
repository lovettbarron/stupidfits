import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Drawer, SIZE, ANCHOR } from "baseui/drawer";

import { useSession, signin, signout } from "next-auth/client";

export default (props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = (pathname) => router.pathname === pathname;
  const toggleTrueFalse = () => setIsOpen(!isOpen);
  const [session, loading] = useSession();

  return (
    <>
      <div className="navigation">
        <a onClick={toggleTrueFalse}>
          <img src="/img/menu.png" />
        </a>
      </div>
      <Drawer
        isOpen={isOpen}
        autoFocus
        onClose={() => setIsOpen(false)}
        size={SIZE.full}
        anchor={ANCHOR.right}
      >
        {(session && (
          <div className="nav">
            <Link href="/">
              <a className="bold" data-active={isActive("/")}>
                Fits
              </a>
            </Link>
            <Link href="/feed">
              <a data-active={isActive("/feed")}>Add Fits</a>
            </Link>
            <Link href="/closet">
              <a data-active={isActive("/closet")}>Closet</a>
            </Link>
            <Link href="/brand">
              <a data-active={isActive("/brand")}>Brands</a>
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
          margin-left: auto;
          position: fixed;
          cursor: pointer;
          top: 1rem;
          right: 1rem;
        }

        .navigation img {
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
          margin: 0;
        }

        footer a {
          font-size: 1.5rem !important;
          margin: 0 1rem;
        }

        footer li {
          margin: 0;
          list-style: none;
        }
        .nav a {
          display: block;
          line-height: 4rem;
          margin: 4rem;
          font-size: 3rem;
          align-items: center;
          color: #ffffff;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};
