import { apiFetch } from "api/ApiClient";

export const create = async (context, genre) => {
    const [response, data, error] = await apiFetch(context, "/genre", "POST", genre);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const get = async (context) => {
    const [response, data, error] = await apiFetch(context, "/genre");
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const update = async (context, id, genre) => {
    const [response, data, error] = await apiFetch(context, "/genre/" + id, "PUT", genre);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const destroy = async (context, id) => {
    const [response, data, error] = await apiFetch(context, "/genre/" + id, "DELETE");
    if(!error && response.status === 200) {
        return data;
    }
    return false;
};