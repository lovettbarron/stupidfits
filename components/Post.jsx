import Router from "next/router";
import ReactMarkdown from "react-markdown";

const Post = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <img alt="Media" src={`/img/demo.png`} />
      <div className="info"></div>

      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }

        .info {
          text-align: center;
          border-radius: 0 0 5px 5px;
          margin: 0 2rem;
          background: #1c1b1b;
        }

        .info a {
          color: #fff;
        }

        img {
          width: 90%;
          min-height: 4rem;
          border: 1px solid white;
        }
      `}</style>
    </div>
  );
};

export default Post;
