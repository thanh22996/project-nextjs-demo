import axios from "axios";
import ShortId from "shortid";
import NodeRSA from "node-rsa";
import CryptoJS from "crypto-js";
import md5 from "md5";
import _ from "lodash";
// import store from '../../configs/store.config'

const Request = {
  callAPI(
    method,
    url,
    pathUrl,
    args,
    headers,
    isSecurity = false,
    publicKey = null,
    priviteKey = null
  ) {
    console.log("method: ", method);
    return new Promise(async (resolve, reject) => {
      try {
        let accessToken = "";
        let lang = "en";
        // console.log(args);
        if (args && args.accessToken) {
          accessToken = `${args.accessToken}`;
          delete args.accessToken;
        }
        if (args && args.lang) {
          lang = `${args.lang}`;
          delete args.lang;
        }
        let apiUrl = `${url}${pathUrl}`;
        let apiHeader = {
          Authorization: accessToken,
          ...headers,
          Language: lang,
          "Content-Type": "application/json; charset=utf-8",
        };
        let apiBody = args;

        if (isSecurity) {
          apiUrl = url;
          const encrypt = Request.RequestEncrypt(
            pathUrl,
            method.toUpperCase(),
            method.toUpperCase() === "GET" ? "" : apiBody,
            apiHeader.Authorization || "",
            publicKey
          );
          apiHeader = { ...encrypt.headers, ...apiHeader };
          apiBody = encrypt.body;
          // console.log('\x1b[33m', '======BEGIN POST========', '\x1b[0m'); console.log({ uri: `${uri}${pathUrl}`, apiHeader, apiBody }); console.log({ apiUrl, apiHeader, apiBody });
        }
        const option = {
          method,
          url: apiUrl,
          headers: apiHeader,
        };
        if (method.toUpperCase() !== "GET") {
          option.data = apiBody;
        } else {
          option.params = apiBody;
        }

        const response = await axios(option);
        if (isSecurity) {
          const httpResponse = response.headers;
          // console.log("httpResponse", httpResponse);
          const ketqua = Request.ResponseDecrypt(
            httpResponse["x-api-action"],
            method.toUpperCase(),
            httpResponse["x-api-client"],
            httpResponse["x-api-key"],
            response.data["x-api-message"],
            httpResponse["x-api-validate"],
            headers.Authorization || "",
            priviteKey
          );
          // console.log({ method, url, pathUrl, args, headers });
          // console.log("\x1b[32m", ketqua, "\x1b[0m");
          // console.log(
          //   "\x1b[33m",
          //   "============END decrypt==========",
          //   "\x1b[0m"
          // );
          return resolve(ketqua);
        }
        resolve(response.data);
      } catch (error) {
        // if (error) console.log(error);
        resolve({
          code: -1001,
          data: { message: "Lỗi kết nối server, Vui lòng quay lại sau" },
        });
      }
    });
  },

  callAPIDownload(
    method,
    url,
    pathUrl,
    args,
    headers,
    isSecurity = false,
    publicKey = null,
    priviteKey = null,
    filedownload
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let accessToken = "";
        let lang = "en";
        if (args && args.accessToken) {
          accessToken = `${args.accessToken}`;
          delete args.accessToken;
        }
        if (args && args.lang) {
          lang = `${args.lang}`;
          delete args.lang;
        }
        let apiUrl = `${url}${pathUrl}`;
        let apiHeader = {
          Authorization: accessToken,
          Language: lang,
          "Content-Type": "application/json; charset=utf-8",
        };
        let apiBody = args;
        if (isSecurity) {
          apiUrl = url;
          const encrypt = Request.RequestEncrypt(
            pathUrl,
            method.toUpperCase(),
            method.toUpperCase() === "GET" ? "" : apiBody,
            apiHeader.Authorization || "",
            publicKey
          );
          apiHeader = { ...encrypt.headers, ...apiHeader };
          apiBody = encrypt.body;
          // console.log('\x1b[33m', '======BEGIN POST========', '\x1b[0m'); console.log({ uri: `${uri}${pathUrl}`, apiHeader, apiBody }); console.log({ apiUrl, apiHeader, apiBody });
        }
        const option = {
          method,
          url: apiUrl,
          headers: apiHeader,
          responseType: "blob",
        };
        if (method.toUpperCase() !== "GET") {
          option.data = apiBody;
        }

        // const response =
        await axios(option).then((response) => {
          // console.log("response download file", response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filedownload);
          document.body.appendChild(link);
          link.click();
        });

        return false;
      } catch (error) {
        resolve({
          code: -1001,
          data: { message: "Lỗi kết nối server, Vui lòng quay lại sau" },
        });
      }
    });
  },

  RequestEncrypt(pathUrl, method, payload, accessToken, publicKey) {
    const encryptKey = ShortId.generate();
    const key = new NodeRSA(publicKey);
    const xAPIKey = key.encrypt(encryptKey, "base64");
    let body = "";
    const xApiAction = CryptoJS.AES.encrypt(pathUrl, encryptKey).toString();
    let xApiMessage = "";
    if (payload) {
      xApiMessage = CryptoJS.AES.encrypt(
        JSON.stringify(payload),
        encryptKey
      ).toString();
    }
    const objValidate = {
      xApiAction,
      method,
      accessToken,
      "x-api-message": xApiMessage,
    };
    const xAPIValidate = md5(_.values(objValidate).join("") + encryptKey);
    body = {
      "x-api-message": xApiMessage,
    };
    const meAPIHeader = {
      "x-api-client": "app",
      "x-api-key": xAPIKey,
      "x-api-action": xApiAction,
      "x-api-validate": xAPIValidate,
    };
    if (accessToken !== "") {
      meAPIHeader.Authorization = accessToken;
    }
    return {
      body,
      headers: meAPIHeader,
    };
  },

  ResponseDecrypt(
    xAPIAction,
    method,
    xAPIClient,
    xAPIKey,
    xAPIMessage,
    xAPIValidate,
    accessToken,
    privateKey
  ) {
    let encryptKey;
    try {
      const key = new NodeRSA(privateKey);
      encryptKey = key.decrypt(xAPIKey, "utf8");
    } catch (error) {
      return {
        code: -1009,
        data: { message: "Lỗi giải mã lấy khóa xác thực API không thành công" },
      };
      // throw new Error('Thông tin "x-api-key" không chính xác');
    }
    const objValidate = {
      "x-api-action": xAPIAction,
      method,
      accessToken,
      "x-api-message": xAPIMessage,
    };
    const validate = md5(_.values(objValidate).join("") + encryptKey);
    if (validate !== xAPIValidate) {
      return { code: -1009, data: { message: "Lỗi xác thực token API" } };
      // throw new Error();
    }
    let result = null;
    try {
      result = JSON.parse(
        CryptoJS.AES.decrypt(xAPIMessage, encryptKey).toString(
          CryptoJS.enc.Utf8
        )
      );
    } catch (error) {
      return {
        code: -1009,
        data: { message: "Dữ liệu API trả về lỗi hoặc không giải mã được" },
      };
      // throw new Error('Thông tin "x-api-message" không chính xác');
    }
    return result;
  },
};

export default Request;
