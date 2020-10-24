import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";

const Pic = ({ media, url }) => {
  return (
    <>
      <div className="holder">
        {(Array.isArray(media) &&
          media.map((m) => (
            <Image
              cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
              publicId={m.cloudinary}
              style={{ width: "100%" }}
              secure={true}
            />
          ))) || <img src={url || `${media.url}media/?size=l`} />}
      </div>
      <style jsx>{`
        .holder {
          width: 100%;
        }

        .holder img {
          width: 100%;
          min-height: 4rem;
        }
      `}</style>
    </>
  );
};

export default Pic;
