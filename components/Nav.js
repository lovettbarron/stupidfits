import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Drawer, SIZE, ANCHOR } from "baseui/drawer";

export default (props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = (pathname) => router.pathname === pathname;
  return (
    <Drawer
      isOpen={props.open}
      autoFocus
      onClose={() => setIsOpen(false)}
      size={SIZE.auto}
      anchor={ANCHOR.right}
    >
      <div className="left">
        <Link href="/">
          <a className="bold" data-active={isActive("/")}>
            Fits
          </a>
        </Link>
        <Link href="/drafts">
          <a data-active={isActive("/drafts")}>Drafts</a>
        </Link>
      </div>
      <div className="right">
        <Link href="/signup">
          <a data-active={isActive("/signup")}>Signup</a>
        </Link>
        <Link href="/create">
          <a data-active={isActive("/create")}>+ Create draft</a>
        </Link>
      </div>
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
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

        .right {
          margin-left: auto;
        }

        .right a {
          border: 1px solid black;
          padding: 0.5rem 1rem;
          border-radius: 3px;
        }
      `}</style>
    </Drawer>
  );
};
