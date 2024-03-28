import React, { DragEvent, useState } from "react";
import { uploadVideo } from "../utils/api";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isOver, setIsOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile) setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (file) {
      try {
        setUploadStatus("Carregando...");
        await uploadVideo(file);
        setUploadStatus("Sucesso");
      } catch (error) {
        setUploadStatus("Erro");
        console.error("Houve o seguinte erro ao subir o vídeo: ", error);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Fetch the files
    const droppedFiles = e.dataTransfer.files[0];
    setFile(droppedFiles);
    setFileName(droppedFiles.name);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <h2>Faça Upload do seu vídeo aqui</h2>
      <input
        type="file"
        title={fileName ?? "Nenhum arquivo selecionado"}
        style={file ? { color: "transparent" } : { color: "black" }}
        onChange={handleFileChange}
      />
      <button onClick={uploadFile}>Enviar</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          width: "300px",
          height: "150px",
          borderStyle: "dotted",
          borderColor: "blue",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: isOver ? "lightgreen" : "white",
        }}
      >
        <p>{fileName ?? `Arraste e solte um arquivo aqui para o upload`}</p>
      </div>
    </div>
  );
};

export default UploadPage;
