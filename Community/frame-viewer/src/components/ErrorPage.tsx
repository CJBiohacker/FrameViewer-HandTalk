import React from "react";
import { useRouteError } from "react-router-dom";
import RouteError from "../types/types-and-interfaces";

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Parece que ocorreu um erro inesperado.</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
}

export default ErrorPage;