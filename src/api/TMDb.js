const TMDB_API_URL = "https://api.themoviedb.org/3";

export const genres = async (tmdb) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/genre/movie/list?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "")),
            { genres } = await response.json();

        if(!genres) throw new Error("no genres");
        return genres;
    }
    catch(error) {
        return null;
    }
};

export const searchMovies = async (tmdb, search) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/search/movie?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "") + "&include_adult=true&query=" + search),
            { results } = await response.json();

        if(!results) throw new Error("no results");
        return results;
    }
    catch(error) {
        return null;
    }
};

export const getMovie = async (tmdb, id) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/movie/" + id + "?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "")),
            data = await response.json();

        if(!data) throw new Error("no data");
        return data;
    }
    catch(error) {
        return null;
    }
};

export const getMovieVideos = async (tmdb, id) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/movie/" + id + "/videos?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "")),
            { results } = await response.json();

        if(!results) throw new Error("no results");
        return results;
    }
    catch(error) {
        return null;
    }
};

export const downloadImage = async (url, savePath, onDownloadProgress) => {
    return new Promise(resolve => {
        resolve(true);
    });
};