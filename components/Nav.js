import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Drawer, SIZE, ANCHOR } from "baseui/drawer";

export default (props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = (pathname) => router.pathname === pathname;
  const toggleTrueFalse = () => setIsOpen(!isOpen);

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
        <div className="navigation set">
          <Link href="/">
            <a onClick={toggleTrueFalse}>
              <img src="/img/menu.png" />
            </a>
          </Link>
        </div>
        <div className="nav">
          <Link href="/">
            <a className="bold" data-active={isActive("/")}>
              Fits
            </a>
          </Link>
          <Link href="/drafts">
            <a data-active={isActive("/drafts")}>Gram</a>
          </Link>
          <Link href="/signup">
            <a data-active={isActive("/signup")}>Closet</a>
          </Link>
          <Link href="/create">
            <a data-active={isActive("/create")}>Brand</a>
          </Link>
          <Link href="/create">
            <a data-active={isActive("/setting")}>Setting</a>
          </Link>
        </div>
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
