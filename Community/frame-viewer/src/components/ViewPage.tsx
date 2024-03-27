import React, { Key, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchFrames } from "../utils/api";
// import Params from "../types/types-and-interfaces";

const ViewPage: React.FC = () => {
  const { id } = useParams<string>();
  const [frames, setFrames] = useState<unknown[]>([]);

  useEffect(() => {
    const getFrames = async () => {
      const data = await fetchFrames(id);
      setFrames(data);
    };

    getFrames();
  }, [id]);

  return (
    <div>
      <h2>Frames do Vídeo {id}</h2>
      <div>
        {frames.map((frame:unknown, index:Key) => (
          <img key={index} src={frame.url} alt={`Frame ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default ViewPage;
