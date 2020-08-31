import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "./Nav";

const Header = () => {
  const router = useRouter();
  return (
    <nav>
      <Nav />
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
      `}</style>
    </nav>
  );
};

export default Header;
