import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Gram from "../components/Gram";
import { useSession, getSession } from "next-auth/client";

const Feed = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>All The Fits</h1>
        <p>Pick your fits from your instagram, share the details.</p>
        <main>
          {props.insta.posts.map((fit) => (
            <Gram
              {...fit}
              fit={
                (props.fits &&
                  props.fits.length > 0 &&
                  props.fits.find(
                    (t) => fit.shortCode === t.media.shortcode
                  )) ||
                null
              }
              username={props.insta.username}
            />
          ))}
        </main>
      </div>
      <style jsx>{`
        main {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .post {
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  // Get user and instagram username
  const res = await fetch(`${process.env.HOST}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  const user = await res.json();

  // Fetch Instagram Feed
  let insta;
  if (user && user.instagram) {
    const res = await fetch(
      `${process.env.HOST}/api/insta/user?id=${user.instagram}`
    );
    insta = await res.json();
  }

  // Fetch fits for this user and check against existing instagram
  const fitres = await fetch(`${process.env.HOST}/api/feed`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  let fits = null;
  try {
    fits = await fitres.json();
  } catch (e) {
    console.log("error:", e.message);
  }

  return {
    props: { insta: insta, fits: fits },
  };
};

export default Feed;
