import axios from "axios";
import Request from "../middleware/request";
import { configAPI } from "../../configs/api.config";

const callAPI = {
  async FetchMockApi() {
    const options = {
      method: "GET",
      headers: { "content-type": "application/json" },
      url: "https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo",
    };
    const data = await axios(options);
    console.log("dataaaaaaaaaaa", data);
    return data;
  },

  getDataRequest({ ...arg }) {
    return callAPI.callTravelookAPI("GET", "/Demo", { ...arg });
  },

  callTravelookAPI(method, pathUrl, body, headers = {}) {
    return Request.callAPI(
      method,
      configAPI.testApi.url,
      pathUrl,
      body,
      headers
    );
  },
};
export default callAPI;
