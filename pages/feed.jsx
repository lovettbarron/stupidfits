import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import FitBox from "../components/FitBox";
import { useSession, getSession } from "next-auth/client";

const Feed = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>All The Fits</h1>
        <main>
          {props.insta.posts.map((fit) => (
            <FitBox
              {...fit}
              hosturl={props.url}
              username={props.insta.username}
            />
          ))}
        </main>
      </div>
      <style jsx>{`
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
  const res = await fetch(`${process.env.HOST}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: context.req.headers.cookie,
    },
  });
  const user = await res.json();
  let insta;
  if (user && user.instagram) {
    const res = await fetch(
      `${process.env.HOST}/api/insta/user?id=${user.instagram}`
    );
    insta = await res.json();
  }
  console.log("insta", insta);
  return {
    props: { insta },
  };
};

export default Feed;
