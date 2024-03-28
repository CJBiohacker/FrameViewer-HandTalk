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

  const elementStyles = {
    divContainer: "tw-flex tw-flex-col tw-gap-4 tw-items-center",
    button:
      "tw-text-xl tw-bg-violet-500 tw-rounded-full tw-px-6 tw-py-1 tw-text-white hover:tw-bg-violet-600 active:tw-bg-violet-700 focus:tw-outline-none focus:tw-ring focus:tw-ring-violet-300",
    dragAndDropArea:
      "tw-w-80 tw-h-40 tw-border-2 tw-border-dashed tw-border-blue-700 tw-flex tw-items-center tw-text-center",
  };

  return (
    <div className={elementStyles.divContainer}>
      <h2>Faça Upload do seu vídeo aqui</h2>
      <input
        type="file"
        title={fileName ?? "Nenhum arquivo selecionado"}
        style={file ? { color: "transparent" } : { color: "black" }}
        onChange={handleFileChange}
      />
      <button className={elementStyles.button} onClick={uploadFile}>
        Enviar
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={elementStyles.dragAndDropArea}
        style={{ backgroundColor: isOver ? "lightgreen" : "white" }}
      >
        <p>{fileName ?? `Arraste e solte um arquivo aqui para o upload`}</p>
      </div>
    </div>
  );
};

export default UploadPage;
