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