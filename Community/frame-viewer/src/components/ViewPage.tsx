import React, { Key, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFrames } from "../utils/api";

const ViewPage: React.FC = () => {
  const { id } = useParams<string>();
  const [frames, setFrames] = useState<string[]>([]);

  useEffect(() => {
    const getFrames = async () => {
      const data = await fetchFrames(id ?? '');
      setFrames(data);
    };

    getFrames();
  }, [id]);

  const elementStyles = {
    title:
      "tw-text-center md:tw-text-2xl sm:tw-text-xl tw-font-bold tw-mb-10 tw-my-4",
    container: "tw-flex tw-flex-wrap tw-justify-center tw-gap-5",
    frameContainer:
      "tw-border-violet-500 tw-border-solid tw-border-2 tw-p-2 relative cursor-pointer",
    image: "tw-w-64 tw-border-solid tw-border-2 tw-border-black tw-rounded-sm",
  };

  return (
    <div>
      <h2 className={elementStyles.title}>
        Frames do Vídeo de ID
        <br />
        {id}
      </h2>
      <div className={elementStyles.container}>
        {frames.map((frame: string, index: Key) => (
          <figure className={elementStyles.frameContainer}>
            <img
              key={index}
              src={frame}
              alt={`Frame ${index}`}
              className={elementStyles.image}
            />
            <figcaption className="tw-text-center">Frame {index.toLocaleString()}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default ViewPage;
