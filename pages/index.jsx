import Layout from "../components/Layout";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";

import { useSession, signin, signout } from "next-auth/client";

const Blog = (props) => {
  const [session, loading] = useSession();

  const iglogin = async () => {
    const url = process.env.HOST || "http://localhost:3000";
    console.log(`${url}/api/insta/auth`);
    const res = await fetch(`${url}/api/insta/auth`);
    const feed = await res.json();
    return {
      props: { feed },
    };
  };

  return (
    <Layout>
      <div className="page">
        <header>
          <h1>Stupid Fits</h1>
          <h2>
            Ingredients for
            <br /> your Fitpics
          </h2>
        </header>
        {!session && (
          <>
            <a className="auth" onClick={signin}>
              <img src={`/img/instagram.png`} />
            </a>
          </>
        )}
        {session && (
          <>
            <a className="auth" onClick={iglogin}>
              <img src={`/img/instagram.png`} />
            </a>
            <br />
            <button onClick={signout}>Sign out</button>
          </>
        )}

        <ol>
          <li>Post Fits on Instagram.</li>
          <li>Link fits with your wardrobe on StupidFits</li>
          <li>Learn what others are doing.</li>
          <li>Repeat.</li>
        </ol>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
        <footer>
          <ul>
            <li>WTF is this?</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </footer>
      </div>
      <style jsx>{`
        header > h1 {
          margin: 0;
        }
        .post {
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

        .post:hover {
        }

        .post + .post {
          margin-top: 2rem;
        }

        footer {
        }

        footer ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }

        footer li {
          margin: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.HOST}/api/feed`);
  const feed = await res.json();
  return {
    props: { feed },
  };
};

export default Blog;
