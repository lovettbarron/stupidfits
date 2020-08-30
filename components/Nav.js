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
      size={SIZE.full}
      anchor={ANCHOR.right}
    >
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
      <style jsx>{`
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
    </Drawer>
  );
};
