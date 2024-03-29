import React from "react";
import { Link, useLocation } from "react-router-dom";
import TabProps from "../../types/types-and-interfaces";

const Tabs: React.FC<TabProps> = ({tabs}) => {
  const location = useLocation();

  return (
    <div className="tw-flex tw-border-4 tw-rounded-t-lg">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`tw-px-6 tw-border-1 tw-rounded-t-lg tw-transition-ctable-autoolors tw-duration-300 ${
            location.pathname === tab.path
              ? " tw-bg-violet-500"
              : "tw-bg-violet-100"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default Tabs;
