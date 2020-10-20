import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Router from "next/router";
import Head from "next/head";
import { useSession, getSession } from "next-auth/client";

const WTF = (props) => {
  return (
    <Layout>
      <Head>
        <title>WTF | Stupid Fits</title>
        <meta property="og:title" content={`WTF Stupid Fits`} key="title" />
        <meta property="og:url" content={`${process.env.HOST}/wtf`} key="url" />
      </Head>
      <main>
        <h1>What is Stupid Fits?</h1>
        <h2>Basically...</h2>
        <p>It's a personal "look book" and closet database.</p>

        <h2>What's the point?</h2>
        <p>
          I did a prototype at the beginning of the year to make{" "}
          <a href="https://andrewlb.com/writing/intentional-wardrobe/">
            a more intentional wardrobe
          </a>{" "}
          in a database program.
        </p>
        <p>
          It was great, and it really changed how I approach things. I carved
          out a bit of time to make a real version of it for us all to use.
        </p>
        <h2>How does it make money?</h2>
        <p>Working on that. It will have to at least pay for itself.</p>
        <h2>Who made this?</h2>
        <p>
          I'm <a href="https://andrewlb.com">Andrew Lovett-Barron</a>, and I run
          a small software/design consultancy called{" "}
          <a href="https://stupidsystems.com">Stupid Systems</a>.
        </p>
        <p>
          I also make <a href="https://knowsi.com">Knowsi</a>, a tool for
          researchers to manage consent, and make clothing and bags at{" "}
          <a href="https://instagram.com/methodmixed">Mixed Method Equipment</a>
        </p>
      </main>
    </Layout>
  );
};

export default WTF;
