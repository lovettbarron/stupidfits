import React, { useEffect, useState, useContext } from "react";
import { Image, Transformation } from "cloudinary-react";
import {
  CarouselProvider,
  Slider,
  Slide,
  Dot,
  DotGroup,
  ButtonBack,
  ButtonNext,
  CarouselContext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import { ArrowLeft, ArrowRight } from "baseui/icon";

const Pic = ({ media, url, user }) => {
  const handleDragStart = (e) => e.preventDefault();

  const mediaArray =
    Array.isArray(media) &&
    media.map((m) => (
      <Image
        cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
        publicId={m.cloudinary} // {m.censor || m.cloudinary}
        style={{ width: "100%" }}
        secure={true}
        onDragStart={handleDragStart}
      >
        {user.hideface && <Transformation effect="pixelate_faces:15" />}
      </Image>
    ));

  return (
    <>
      <div className="holder">
        {(media.length > 1 && (
          <CarouselProvider
            totalSlides={media.length}
            visibleSlides={1}
            step={1}
            isIntrinsicHeight={true}
            // naturalSlideWidth={400}
            // naturalSlideHeight={400}
            innerClassName={"carousel"}
          >
            <div className="arrows">
              <ButtonBack className="navbutton" style={{ border: 0 }}>
                <ArrowLeft size={42} />
              </ButtonBack>

              <ButtonNext className="navbutton" style={{ border: 0 }}>
                <ArrowRight size={42} />
              </ButtonNext>
            </div>
            <Slider>
              {mediaArray.map((m, i) => (
                <Slide key={i} index={i}>
                  {m}
                </Slide>
              ))}
            </Slider>
            {/* <div>
              {media.map((m, i) => (
                <Dot
                  key={i}
                  slide={i}
                  style={{
                    border: 0,
                    background: "#151515",
                    borderRadius: "100%",
                    margin: "1rem",
                    width: "1rem",
                    height: "1rem",
                    padding: 0,
                  }}
                />
              ))}
            </div> */}
          </CarouselProvider>
        )) || (
          <Image
            cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
            publicId={media[0].cloudinary} // {media[0].censor || media[0].cloudinary}
            style={{ width: "100%" }}
            secure={true}
            onDragStart={handleDragStart}
          >
            {user.hideface && <Transformation effect="pixelate_faces:15" />}
          </Image>
        )}
      </div>
      <style jsx>{`
        .holder {
          width: 100%;
          max-width: 600px;
          position: relative;
        }

        .carousel {
          padding: 0;
          margin: 0;
        }

        .carousel li {
          padding: 0;
        }

        .arrows {
          position: absolute;
          top: 50%;
          margin-top: -32px;
          width: 100%;
          z-index: 1;
          display: flex;
          justify-content: space-between;
        }

        .arrows .navbutton {
          cursor: pointer;
          border: none !important;
        }

        .alice-carousel {
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
