import axios from "axios";

const callAPI = {
  async FetchMockApi() {
    return new Promise(async (resolve) => {
      try {
        const response = await axios({
          method: "GET",
          url: "https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo",
          timeout: 1000,
        });

        if (process.env.NODE_ENV === "development") {
          console.log("[RESPONSE]", apiUrl, response.data);
        }
        resolve({ code: response.status, data: response.data });
      } catch (error) {
        if (error) console.log(error);
        resolve({
          code: -1001,
          data: {
            message: "Lỗi kết nối server. Vui lòng quay lại sau!",
          },
        });
      }
    });
  },
  //   FetchMockApi() {
  //     const response = await axios({
  //         method,
  //         url: "https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo",
  //         timeout: 1000,
  //     });
  //     return response;
  //   },
};
export default callAPI;
