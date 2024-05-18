import { CircularProgress } from "react-loading-indicators";
import "~~/styles/globals.css";

/**
 * Spinner Component
 * @returns
 */
const Loading = () => {
  return (
    <div className="loading">
      <CircularProgress variant="dotted" color="#316acc" size="large" text="wait..." textColor="" />
    </div>
  );
};

export default Loading;
