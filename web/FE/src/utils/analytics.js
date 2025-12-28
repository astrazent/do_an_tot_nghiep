import ReactGA from "react-ga4";
const VITE_GA4_ID = import.meta.env.VITE_GA4_ID

ReactGA.initialize(VITE_GA4_ID);

export default ReactGA;