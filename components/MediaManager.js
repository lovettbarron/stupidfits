import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import { FileUploader } from "baseui/file-uploader";
import { Button } from "baseui/button";
import ImageMini from "./ImageMini";

const MediaManager = (props) => {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState(props.media || []);
  const [files, setFiles] = useState([]);
  const [cloud, setCloud] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [isUploading, setIsUploading] = React.useState(false);
  const timeoutId = React.useRef(null);

  const removeMedia = (id) => {
    console.log("removing media (TEST)", id);
  };

  function reset() {
    setIsUploading(false);
    clearTimeout(timeoutId.current);
  }
  // startProgress is only illustrative. Use the progress info returned
  // from your upload endpoint. This example shows how the file-uploader operates
  // if there is no progress info available.
  const uploadFiles = async (files) => {
    setIsUploading(true);
    const url = "https://api.cloudinary.com/v1_1/stupidsystems/image/upload";

    const formData = new FormData();
    await setFiles(files);

    const requests = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      formData.append("file", file);
      formData.append("upload_preset", "stupidfits");

      requests[i] = fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then(async (data) => {
          console.log("Returned", data);
          await setCloud((c) => [...c, data.public_id]);
          return data.public_id;
        })
        .catch((e) => {
          setErrorMessage("Error", e);
          setIsUploading(false);
        });
    }
    Promise.all(requests).then((reqs) => {
      console.log("All reqs completed", reqs);
      updateFromUpload(reqs);
    });
  };

  const updateFromUpload = async (reqs) => {
    try {
      const body = {
        id: props.id,
        imgs: reqs,
      };

      console.log("Adding Media", `${process.env.HOST}/api/fits/create`, body);

      const res = await fetch(`${process.env.HOST}/api/media/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log("Added review media!", data);
      setMedia(data.media);
      props.handle && props.handle(media);
      setIsUploading(false);
      // Might need to add a handler function here
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {};
  }, [session]);

  return (
    <div className="manager">
      <FileUploader
        onCancel={reset}
        onDrop={(acceptedFiles, rejectedFiles) => {
          uploadFiles(acceptedFiles);
        }}
        disabled={!!props.id ? false : true}
        progressMessage={isUploading ? `Uploading... hang tight.` : ""}
      />
      {media.map((m) => (
        <ImageMini
          media={m}
          handler={(id) => removeMedia(id)}
          maxwidth={"100px"}
        />
      ))}

      <style jsx>{`
        .manager {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }

        button {
          margin: 1rem 0 0 0;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MediaManager;
