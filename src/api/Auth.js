import { _fetch } from "utils/HttpClient";

export const login = async (server, account) => {
    const [response, data, error] = await _fetch(server, "/auth/login", "POST", null, account);
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};

export const token = async (server, refreshToken) => {
    const [response, data, error] = await _fetch(server, "/auth/token", "POST", null, { refresh_token: refreshToken });
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};