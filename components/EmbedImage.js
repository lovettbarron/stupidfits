import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Anatomy from "./Anatomy";
import Image from "./Image";
import Mini from "./Mini";
import { Button } from "baseui/button";

const EmbedImage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState([]);
  const [gallery, setGallery] = useState(null);
  const [mid, setMid] = useState(id || null);

  const fetchMedia = async () => {
    if (!mid) return;
    const posts = await fetch(`${process.env.HOST}/api/media/${mid}`);
    const payload = await posts.json();
    setGallery(payload.data);
  };

  const fetchAll = async () => {
    console.log("Fetching media");
    const posts = await fetch(`${process.env.HOST}/api/media/`);
    const payload = await posts.json();
    setGallery(payload.data);
  };

  useEffect(() => {
    console.log("Media ID change", mid);
    if (!mid) fetchAll();
    else if (mid && media) fetchMedia();
    return () => {};
  }, [mid]);

  if (!media && !gallery) return <div>Loading...</div>;
  if (!media && gallery)
    return (
      <div>
        {gallery.map((i) => (
          <Mini {...g} />
        ))}
      </div>
    );
  return (
    <div className="fitbox">
      <Image media={media} />

      <style jsx>{`
        .fitbox {
          margin: 2rem 2.5%;
          max-width: 40%;
        }
      `}</style>
    </div>
  );
};
export default EmbedImage;
