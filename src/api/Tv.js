import { apiFetch } from "api/ApiClient";
import axios from "axios";

export const create = async (context, tv) => {
    const [response, data, error] = await apiFetch(context, "/tv", "POST", tv);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const update = async (context, id, tv) => {
    const [response, data, error] = await apiFetch(context, "/tv/" + id, "PUT", tv);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const updateGenres = async (context, id, genres) => {
    const [response, data, error] = await apiFetch(context, "/tv/" + id + "/genres", "PUT", genres);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const get = async (context) => {
    const [response, data, error] = await apiFetch(context, "/tv");
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const getTv = async (context, id) => {
    const [response, data, error] = await apiFetch(context, "/tv/" + id);
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
            server + "/api/tv/" + id + "/upload",
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

export const remove = async (context, id, fileName) => {
    const [response, data, error] = await apiFetch(context, "/tv/" + id + "/remove", "POST", { fileName: fileName });
    if(!error && response.status === 200) {
        return data;
    }
    return false;
};

export const destroy = async (context, id) => {
    const [response, data, error] = await apiFetch(context, "/tv/" + id, "DELETE");
    if(!error && response.status === 200) {
        return data;
    }
    return false;
};

export const getMediaFile = (context, id, file) => {
    return context.state.server + "/api/tv/" + id + "/" + file + "?token=" + context.state.accessToken;
};

export const destroyEpisode = async (context, tvId, season, episode) => {
    const [response, data, error] = await apiFetch(context, "/tv/" + tvId + "/" + season + "/" + episode, "DELETE");
    if(!error && response.status === 200) {
        return data;
    }
    return false;
};

export const createEpisode = async (context, tvId, season, episode, theEpisode) => {
    const [response, data, error] = await apiFetch(context, "/tv/" + tvId + "/" + season + "/" + episode, "POST", theEpisode);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const uploadEpisode = async (context, tvId, season, episode, file, fileName = null, onUploadProgress = null) => {
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
            server + "/api/tv/" + tvId + "/" + season + "/" + episode + "/upload",
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