import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import fetch from "isomorphic-unfetch";
import Router from "next/router";

async function publish(id) {
  const res = await fetch(`${process.env.HOST}/api/publish/${id}`, {
    method: "PUT",
  });
  const data = await res.json();
  await Router.push("/");
}

async function destroy(id) {
  const res = await fetch(`${process.env.HOST}/api/post/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  Router.push("/");
}

const Post = (props) => {
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }
  const authorName = props.author ? props.author.name : "Unknown author";
  return (
    <Layout>
      <div className="page">
        <h2>{title}</h2>
        <small>By {authorName}</small>
        <ReactMarkdown source={props.content} />
        <div className="actions">
          {!props.published && (
            <button onClick={() => publish(props.id)}>Publish</button>
          )}
          <button onClick={() => destroy(props.id)}>Delete</button>
        </div>
      </div>
      <style jsx>{`
        .page {
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          border: 1px solid #ffffff;
          background: transparent;
          color: #ffffff;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const res = await fetch(`${process.env.HOST}/api/post/${context.params.id}`);
  const data = await res.json();
  return { props: { ...data } };
};

export default Post;
