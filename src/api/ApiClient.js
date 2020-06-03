//Imports
import { _fetch } from "utils/HttpClient";
import * as Auth from "api/Auth";

export const apiFetch = async (context, path, method = "GET", body = null) => {
    try {
        const { accessToken, refreshToken } = context.state;
        if(!accessToken || !refreshToken) {
            throw new Error("no tokens provided");
        }

        const [response, data, error] = await _fetch(context.state.server, path, method, accessToken, body);
        if(error) {
            return [null, null, error];
        }
        else if(response.status === 403) {
            //request new token
            const data = await Auth.token(context.state.server, refreshToken);
            if(data) {
                const { access_token, refresh_token } = data;

                let newState = context.state;
                newState.accessToken = access_token;
                newState.refreshToken = refresh_token;
                context.setState(newState);
                
                const [newResponse, newData, newError] = await _fetch(context.state.server, path, method, access_token, body);
                return [newResponse, newData, newError];
            }
            else {
                return [null, null, null];
            }
        }
        else {
            return [response, data, error];
        }
    }
    catch(error) {
        return [null, null, error];
    }
};