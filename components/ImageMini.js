import React, { useEffect, useState, useContext, useRef } from "react";
import { Image, Transformation } from "cloudinary-react";
import { useSession } from "next-auth/client";

import { Button } from "baseui/button";

const Mini = ({ media, handler, hideid, maxwidth }) => {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {};
  }, [session]);

  return (
    <div className="mini" style={maxwidth && { maxWidth: maxwidth }}>
      {!hideid && <div className="id">#{media.id}</div>}
      <Image
        cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
        publicId={(media && media.cloudinary) || "stupidfits/appicon"}
        style={{ width: "100%" }}
        secure={true}
      >
        <Transformation width="500" height="500" crop="fill" gravity="face" />

        {/* {user.hideface && <Transformation effect="pixelate_faces:15" />} */}
      </Image>

      <style jsx>{`
        .mini {
          width: 100%;
          position: relative;
        }

        .id {
          position: absolute;
          top: 0;
          right: 0;
          width: 30%;
          font-size: 16px;
        }

        button {
          margin: 1rem 0 0 0;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Mini;
