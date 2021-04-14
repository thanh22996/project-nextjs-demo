import axios from "axios";

const callAPI = {
  async FetchMockApi() {
    // return new Promise(async (resolve) => {
    //   try {
    //     const response = await axios({
    //       method: "GET",
    //       url: "https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo",
    //       timeout: 1000,
    //     });

    //     if (process.env.NODE_ENV === "development") {
    //       console.log("[RESPONSE]", apiUrl, response.data);
    //     }
    //     resolve({ code: response.status, data: response.data });
    //   } catch (error) {
    //     if (error) console.log(error);
    //     resolve({
    //       code: -1001,
    //       data: {
    //         message: "Lỗi kết nối server. Vui lòng quay lại sau!",
    //       },
    //     });
    //   }
    // });
    // const data = await fetch(
    //   `https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo`
    // );
    // console.log(data);
    // return data;
    const options = {
      method: "GET",
      headers: { "content-type": "application/json" },
      url: "https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo",
    };
    const data = await axios(options);
    console.log("dataaaaaaaaaaa", data);
    return data;
    // console.log(data);
    // return true;
    // return axios({
    //   method: "GET",
    //   responseType: "text",
    //   url: "https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo",
    // });
    // return fetch("https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo");

    // const { data: products } = await axios.get(
    //   `https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo`
    // );
    // return { props: { products } };
    // // const response = await axios(
    // //   "https://60769d2b1ed0ae0017d6962f.mockapi.io/Demo"
    // // );
    // // return response;
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
