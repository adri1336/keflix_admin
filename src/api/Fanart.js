const FANART_API_URL = "http://webservice.fanart.tv/v3";

export const getMovieImages = async (fanart, id) => {
    try {
        const response = await fetch(FANART_API_URL + "/movies/" + id + "?api_key=" + fanart?.api_key);
        if(response.status !== 200) throw new Error("invalid api key");

        const results = await response.json();
        if(!results) throw new Error("no results");
        return results;
    }
    catch(error) {
        return null;
    }
};

export const getTvImages = async (fanart, id) => {
    try {
        const response = await fetch(FANART_API_URL + "/tv/" + id + "?api_key=" + fanart?.api_key);
        if(response.status !== 200) throw new Error("invalid api key");

        const results = await response.json();
        if(!results) throw new Error("no results");
        return results;
    }
    catch(error) {
        return null;
    }
};