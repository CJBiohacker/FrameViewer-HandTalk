import { Outlet } from "react-router-dom";
import Tabs from "./Shared/Tabs";

const defaultStyle = "tw-font-bold tw-text-center";
const tabs = [
  { label: "Home", path: "/" },
  { label: "Upload", path: "/upload" },
  { label: "Listagem", path: "/list" },
];

const HomePage: React.FC = () => (
  <div className="tw-flex tw-flex-col tw-gap-5">
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
      <img
        className="tw-w-40"
        src="src/assets/Frame-Viewer-Logo.svg"
        alt="frame viewer logo"
      />
      <div id="logo-text" className="tw-text-center tw-text-2xl">
        <h1>Frame Viewer</h1>
      </div>
    </div>
    <h1 className={`${defaultStyle}`}>Selecione a opção desejada</h1>
    <div
      className={`tw-flex tw-justify-center tw-items-center tw-text-2xl tw-gap-5 ${defaultStyle}`}
    >
      <Tabs tabs={tabs} />
    </div>
    <div id="childrenPage">
      <Outlet />
    </div>
  </div>
);

export default HomePage;
