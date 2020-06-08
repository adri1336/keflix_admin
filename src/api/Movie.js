import { apiFetch } from "api/ApiClient";
import axios from "axios";

export const get = async (context) => {
    const [response, data, error] = await apiFetch(context, "/movie");
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const upload = async (context, id, file, fileName = null, onUploadProgress = null) => {
    const { server, accessToken } = context.state;

    let data = new FormData();
    data.append("file", file);
    if(fileName) {
        data.append("fileName", fileName);
    }

    const options = {
        headers: {
            Authorization: "Bearer " + accessToken
        },
        onUploadProgress: onUploadProgress
    };

    return new Promise(resolve => {
        axios.post(
            server + "/api/movie/" + id + "/upload",
            data,
            options
        )
            .then(response => {
                console.log("response: ", response);
                if(response.status === 200) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
            .catch(() => resolve(false));
    });
};