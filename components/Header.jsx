import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "./Nav";

const Header = () => {
  const router = useRouter();
  const [isToggled, setToggled] = useState(false);
  const toggleTrueFalse = () => setToggled(!isToggled);
  const isActive = (pathname) => router.pathname === pathname;
  return (
    <nav>
      <Nav open={isToggled} />
      <div className="navigation">
        <Link href="/">
          <a className="bold" onClick={toggleTrueFalse}>
            <img src="/img/menu.png" />
          </a>
        </Link>
      </div>
      <style jsx>{`
        nav {
          display: flex;
          padding: 0.4rem;
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
      `}</style>
    </nav>
  );
};

export default Header;
