import Layout from "../components/Layout";
import fetch from "isomorphic-unfetch";
import Post from "../components/Post";

const Blog = (props) => {
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

        <a className="auth" href="/">
          <img src={`/img/instagram.png`} />
        </a>
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
      `}</style>
      r
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const res = await fetch("/api/feed");
  const feed = await res.json();
  return {
    props: { feed },
  };
};

export default Blog;
