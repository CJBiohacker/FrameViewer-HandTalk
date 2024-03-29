import React, { useState, useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVideosMetadata } from "../utils/api";
import Video from "../types/types-and-interfaces";

const ListPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getVideos = async () => {
      const data = await fetchVideosMetadata();
      const sortByDesc = data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      setVideos(sortByDesc);
    };

    getVideos();
  }, []);

  const viewFrames = (videoId:string) => {
    navigate(`/view/${videoId}`);
  }

  const elementStyles = {
    container: "tw-flex tw-flex-col tw-items-center tw-justify-center",
    table: "tw-table-auto tw-border-collapse tw-border",
    header: "tw-p-1 tw-border",
    row: "tw-p-4 tw-border",
    button:
      "tw-text-xl tw-bg-violet-500 tw-rounded-full tw-px-6 tw-text-white hover:tw-bg-violet-600 active:tw-bg-violet-700 focus:tw-outline-none focus:tw-ring focus:tw-ring-violet-300",
  };

  return (
    <div className={elementStyles.container}>
      <h2 className="tw-text-xl">Lista de Vídeos</h2>
      <table className={elementStyles.table}>
        <thead>
          <tr>
            <th className={elementStyles.header}>Id</th>
            <th className={elementStyles.header}>Nome do Arquivo</th>
            <th className={elementStyles.header}>Quantidade de Frames</th>
            <th className={elementStyles.header}>Data de Criação</th>
            <th className={elementStyles.header}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video: Video) => (
            <tr key={video.id}>
              <td className={elementStyles.row}>{video.id}</td>
              <td className={elementStyles.row}>{video.fileName}</td>
              <td className={elementStyles.row}>{video.frameCount}</td>
              <td className={elementStyles.row}>{video.createdAt}</td>
              <td className={elementStyles.row}>
                <button className={elementStyles.button} onClick={ () => viewFrames(video.id)}>Ver Frames</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPage;
