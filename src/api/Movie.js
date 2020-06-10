import { apiFetch } from "api/ApiClient";
import axios from "axios";

export const create = async (context, movie) => {
    const [response, data, error] = await apiFetch(context, "/movie", "POST", movie);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const update = async (context, id, movie) => {
    const [response, data, error] = await apiFetch(context, "/movie/" + id, "PUT", movie);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const updateGenres = async (context, id, genres) => {
    const [response, data, error] = await apiFetch(context, "/movie/" + id + "/genres", "PUT", genres);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

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