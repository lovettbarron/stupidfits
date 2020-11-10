import React, { useEffect, useState, useContext, useRef } from "react";
import { Image, Transformation } from "cloudinary-react";
import { useSession } from "next-auth/client";

import { Button } from "baseui/button";

const Mini = ({ media, handler }) => {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {};
  }, [session]);

  return (
    <div className="mini">
      <Image
        cloudName={process.env.CLOUDINARY_CLOUD_NAME || "stupidsystems"}
        publicId={media.cloudinary}
        style={{ width: "100%" }}
        secure={true}
      >
        <Transformation width="300" height="300" crop="scale" />

        {user.hideface && <Transformation effect="pixelate_faces:15" />}
      </Image>

      <style jsx>{`
        .mini {
          margin: 2rem 2.5%;
          max-width: 20%;
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
