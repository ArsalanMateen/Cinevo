import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

class MovieDataService {
  getAll(page = 0, sort = null, moviesPerPage = 20) {
    let url = `${API}/api/v1/movies?page=${page}&moviesPerPage=${moviesPerPage}`;
    if (sort) {
      url += `&sort=${sort}`;
    }
    return axios.get(url);
  }
}

const movieDataService = new MovieDataService();
export default movieDataService;
