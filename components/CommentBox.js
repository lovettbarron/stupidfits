import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { Textarea } from "baseui/textarea";
import { SIZE } from "baseui/input";
import { Button } from "baseui/button";

const CommentBox = (props) => {
  const [session, loading] = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addComment = async () => {
    setIsLoading(true);
    console.log("Setting comment for", props.id, comment);
    try {
      const body = {
        comment,
      };

      const res = await fetch(`${process.env.HOST}/api/comment/${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Added fit!", data);
      if (data) {
        setIsLoading(false);
        setComment("");
        fetchComments();
      }
    } catch (error) {
      console.error(error);
      setComments([]);
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    setIsLoading(true);
    const b = await fetch(`${process.env.HOST}/api/comment/${props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let it = [];

    it = await b.json();
    setComments(it);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!Array.isArray(comments)) fetchComments();

    return () => {};
  }, []);

  return (
    <>
      <div className="commentbox">
        {(comments &&
          comments.map((c) => (
            <div className="comment" key={c.id}>
              <div className="user">
                <Link href={`/u/${c.user.username}`}>
                  <a>{c.user.username}</a>
                </Link>
              </div>
              <div className="c">{c.comment}</div>
            </div>
          ))) || (
          <div className="comment">
            {isLoading ? `Loading comments` : `No comments yet`}
          </div>
        )}
        <>
          {session && (
            <>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                size={SIZE.mini}
                placeholder="Add a comment"
                clearOnEscape
              />
              <Button
                className="left"
                onClick={() => addComment()}
                size={SIZE.mini}
                isLoading={isLoading}
                disabled={comment.length < 3}
              >
                Submit Comment
              </Button>
            </>
          )}
        </>
      </div>
      <style jsx>{`
        .comment {
          margin: 0.5rem;
          padding: 0.5rem;
          display: flex;
          flex: 1 1 0;
          justify-content: space-around;
          align-items: center;
          text-align: left;
        }

        .user {
          width: 20%;
        }
        .c {
          border: 1px solid black;
          border-radius: 3px;
          padding: 1rem;
          width: 70%;
        }
      `}</style>
    </>
  );
};

export default CommentBox;
