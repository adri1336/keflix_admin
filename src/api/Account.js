import { _fetch } from "utils/HttpClient";
import { apiFetch } from "api/ApiClient";

export const getPassToken = async (server, accessToken) => {
    const [response, data, error] = await _fetch(server, "/account", "GET", accessToken);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const list = async (context) => {
    const [response, data, error] = await apiFetch(context, "/account/list");
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};