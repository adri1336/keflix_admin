import { apiFetch } from "api/ApiClient";

export const get = async (context) => {
    const [response, data, error] = await apiFetch(context, "/info");
    if(!error && response.status === 200) {
        return data;
    }
    return null;
};