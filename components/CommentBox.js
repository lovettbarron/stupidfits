import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import Router from "next/router";
import Link from "next/link";
import { Select } from "baseui/select";
import { Input } from "baseui/input";
import { FileUploader } from "baseui/file-uploader";
import { useUpload } from "use-cloudinary";
import { useSession } from "next-auth/client";
import { Textarea } from "baseui/textarea";
import { SIZE } from "baseui/input";
import { Button } from "baseui/button";

const CommentBox = (props) => {
  const [session, loading] = useSession();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const body = {
        comment: props.caption,
      };

      const res = await fetch(`${process.env.HOST}/api/comment/${props.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Added fit!", data);
      if (data) Router.push(`/fit/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // component is used for both displaying instagram images that aren't yet in the db, and fits that are currently in the db. It probably shouldn't, but this just prevent weird api request

    return () => {};
  }, [session]);

  const comments = [
    {
      comment: "Testing",
      user: {
        username: "stupidfits",
      },
    },
    {
      comment: "Testing a larger comment, maybe this can work out ookay",
      user: {
        username: "stupidfits",
      },
    },
  ];

  return (
    <>
      <div className="commentbox">
        {comments.map((c) => (
          <div className="comment">
            <div className="user">
              <Link href={`/u/${c.user.username}`}>
                <a>{c.user.username}</a>
              </Link>
            </div>
            <div className="c">{c.comment}</div>
          </div>
        ))}
        <>
          {session && (
            <>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                size={SIZE.mini}
                placeholder="Controlled Input"
                clearOnEscape
              />
              <Button
                className="left"
                onClick={() => alert("click")}
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
