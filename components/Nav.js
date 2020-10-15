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
        <Link href="/">
          <a onClick={toggleTrueFalse}>
            <img src="/img/menu.png" />
          </a>
        </Link>
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
              <a data-active={isActive("/feed")}>Gram</a>
            </Link>
            <Link href="/closet">
              <a data-active={isActive("/closet")}>Closet</a>
            </Link>
            <Link href="/global">
              <a data-active={isActive("/closet")}>Others' Fits</a>
            </Link>
            <Link href="/me">
              <a data-active={isActive("/me")}>Setting</a>
            </Link>
            <hr />

            <a onClick={signin}>Sign out</a>

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
          </div>
        )) || <h3>You're not logged in.</h3>}
      </Drawer>
      <style jsx>{`
        .navigation {
          margin-left: auto;
          position: fixed;
          top: 1rem;
          right: 1rem;
        }

        .navigation img {
          width: 2rem;
        }

        .navigation a {
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
