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
import Layer from "./Layer";

import { ArrowLeft, ArrowRight } from "baseui/icon";

const MediaHolder = (props) => (
  <div className="mediaholder">
    {props.m && props.m.layers && props.m.layers.length > 0 && (
      <div className="layermap">
        {props.m.layers.map((l) => (
          <Layer {...l} />
        ))}
      </div>
    )}
    <>{props.children}</>
    <style jsx>{`
      .mediaholder {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .mediaholder > * {
        transition: opacity 0.4s;
        opacity: 1;
      }

      .mediaholder:hover > * {
        opacity: 0;
      }
    `}</style>
  </div>
);

const Pic = ({ media, url, user }) => {
  const handleDragStart = (e) => e.preventDefault();

  const mediaArray =
    Array.isArray(media) &&
    media.map((m) => (
      <MediaHolder m={m}>
        <Image
          cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
          publicId={m.cloudinary} // {m.censor || m.cloudinary}
          style={{ width: "100%" }}
          secure={true}
          onDragStart={handleDragStart}
        >
          {user.hideface && <Transformation effect="pixelate_faces:15" />}
        </Image>
      </MediaHolder>
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
          <MediaHolder m={[media[0]]}>
            <Image
              cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
              publicId={media[0].cloudinary} // {media[0].censor || media[0].cloudinary}
              style={{ width: "100%" }}
              secure={true}
              onDragStart={handleDragStart}
            >
              {user.hideface && <Transformation effect="pixelate_faces:15" />}
            </Image>
          </MediaHolder>
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

        .mediaholder {
          width: 100%;
          height: 100%;
          position: relative;
          opacity: 1;
          transition: opacity .4s ;
        }

        .holder:hover .mediaholder {
          opacity: 0
        }

        .layermap {
          position: absolute;
          top: 0; left; bottom: 0; right: 0;
          width: 100%; height: 100%;
          transition: opacity 0.4s;
          opacity: 1;
        }


      .layermap:hover {
        opacity: 0;
      }
      `}</style>
    </>
  );
};

export default Pic;
