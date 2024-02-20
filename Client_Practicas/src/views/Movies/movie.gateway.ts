import Axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getMoviesByTitle = async (title: string, pageable: string) => {
    try {
        const response = await Axios.post(`${API_URL}/movie/findByTitle${pageable}`, {
            title: title
        });
        return response.data;
    } catch (e) {
        console.log(e)
    }
}

export const getMoviesByDirectorName = async (directorName: string, pageable: string) => {
    try {
        const response = await Axios.post(`${API_URL}/movie/findByDirectorName${pageable}`, {
            director: directorName
        });
        return response.data;
    } catch (e) {
        console.log(e)
    }
}