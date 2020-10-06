const TMDB_API_URL = "https://api.themoviedb.org/3";

export const genres = async (tmdb) => {
    try {
        let allGenres = [];

        let response = await fetch(TMDB_API_URL + "/genre/movie/list?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : ""));
        const movieGenres = await response.json();

        response = await fetch(TMDB_API_URL + "/genre/tv/list?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : ""));
        const tvGenres = await response.json();

        movieGenres.genres.forEach(genre => {
            allGenres.push(genre);    
        });
        
        tvGenres.genres.forEach(genre => {
            let push = true;
            for (let index = 0; index < movieGenres.length; index++) {
                const movieGenre = movieGenres[index];
                if(movieGenre.name === genre.name) {
                    push = false;
                    break;
                }
            }
            
            if(push) {
                allGenres.push(genre);
            }
        });
        
        if(!allGenres) throw new Error("no genres");
        return allGenres;
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

export const searchTvs = async (tmdb, search) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/search/tv?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "") + "&include_adult=true&query=" + search),
            { results } = await response.json();

        if(!results) throw new Error("no results");
        return results;
    }
    catch(error) {
        return null;
    }
};

export const getTv = async (tmdb, id) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/tv/" + id + "?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "")),
            data = await response.json();

        if(!data) throw new Error("no data");
        return data;
    }
    catch(error) {
        return null;
    }
};

export const getTvVideos = async (tmdb, id) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/tv/" + id + "/videos?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "")),
            { results } = await response.json();

        if(!results) throw new Error("no results");
        return results;
    }
    catch(error) {
        return null;
    }
};

export const tvEpisodeInfo = async (tmdb, tvId, season, episode) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/tv/" + tvId + "/season/" + season + "/episode/" + episode + "?api_key=" + tmdb?.api_key + (tmdb?.lang ? "&language=" + tmdb.lang : "")),
            results = await response.json();

        if(!results) throw new Error("no results");
        return results;
    }
    catch(error) {
        return null;
    }
};

export const getTvExternalIds = async (tmdb, id) => {
    try {
        const
            response = await fetch(TMDB_API_URL + "/tv/" + id + "/external_ids?api_key=" + tmdb?.api_key),
            data = await response.json();

        if(!data) throw new Error("no data");
        return data;
    }
    catch(error) {
        return null;
    }
};