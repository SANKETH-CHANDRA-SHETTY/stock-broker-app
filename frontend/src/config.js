// Config updated for Production
const PROD_URL = "stock-broker-app-production.up.railway.app"; 

const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : PROD_URL;

export default API_URL;