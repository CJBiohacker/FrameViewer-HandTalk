import React, { useState, useEffect } from "react";
import { fetchVideos } from "../utils/api";
import Video from "../types/types-and-interfaces";

const ListPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const getVideos = async () => {
      const data = await fetchVideos();
      setVideos(data);
    };

    getVideos();
  }, []);

  return (
    <div>
      <h2>Lista de Vídeos</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome do Arquivo</th>
            <th>Quantidade de Frames</th>
            <th>Data de Criação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video: Video) => (
            <tr key={video.id}>
              <td>{video.id}</td>
              <td>{video.fileName}</td>
              <td>{video.frameCount}</td>
              <td>{video.createdAt}</td>
              <td>
                <button>Ver Frames</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPage;
