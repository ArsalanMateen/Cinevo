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

  get(id) {
    return axios.get(`${API}/api/v1/movies/id/${id}`);
  }

  find(query, by, page, moviesPerPage, sort) {
    let url = `${API}/api/v1/movies?${by}=${encodeURIComponent(query)}&page=${page}&moviesPerPage=${moviesPerPage}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    return axios.get(url);
  }

  getGenres() {
    return axios.get(`${API}/api/v1/movies/genres`);
  }

  login(data) {
    return axios.post(`${API}/api/v1/movies/users/login`, data);
  }

  register(data) {
    return axios.post(`${API}/api/v1/movies/users/register`, data);
  }
}

export default new MovieDataService();
