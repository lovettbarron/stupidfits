import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const Pic = ({ media, url }) => {
  const responsive = {
    0: { items: 1 },
  };

  const handleDragStart = (e) => e.preventDefault();

  const mediaArray =
    Array.isArray(media) &&
    media.map((m) => (
      <Image
        cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
        publicId={m.cloudinary}
        style={{ width: "100%" }}
        secure={true}
        onDragStart={handleDragStart}
      />
    ));

  return (
    <>
      <div className="holder">
        {(Array.isArray(media) && (
          <AliceCarousel
            responsive={responsive}
            autoWidth
            infinite
            mouseTracking
            // controlsStrategy=
            items={mediaArray}
          />
        )) || <img src={url || `${media.url}media/?size=l`} />}
      </div>
      <style jsx>{`
        .holder {
          width: 100%;
          max-width: 600px;
        }

        .alice-carousel {
          max-with: 600px;
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
