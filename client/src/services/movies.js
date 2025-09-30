import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

class MovieDataService {
  getAll(page, sort, moviesPerPage) {
    let url = `${API}/api/v1/movies?page=${page}&moviesPerPage=${moviesPerPage}`;
    if (sort) {
      url += `&sort=${sort}`;
    }
    return axios.get(url);
  }
}

const movieDataService = new MovieDataService();
export default movieDataService;
