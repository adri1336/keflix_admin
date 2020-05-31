import { _fetch } from "utils/HttpClient";

export const getPassToken = async (server, accessToken) => {
    const [response, data, error] = await _fetch(server, "/account", "GET", accessToken);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};