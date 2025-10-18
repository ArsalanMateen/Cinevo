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

  get(id) {
    return axios.get(`${API}/api/v1/movies/id/${id}`);
  }

  find(query, by = "title", page = 0, moviesPerPage = 20, sort = null) {
    let url = `${API}/api/v1/movies?${by}=${encodeURIComponent(query)}&page=${page}&moviesPerPage=${moviesPerPage}`;

    if (sort) {
      url += `&sort=${sort}`;
    }

    return axios.get(url);
  }

  getGenres() {
    return axios.get(`${API}/api/v1/movies/genres`);
  }

  createReview(data) {
    return axios.post(`${API}/api/v1/movies/reviews`, data);
  }

  updateReview(data) {
    return axios.put(`${API}/api/v1/movies/reviews`, data);
  }

  login(data) {
    return axios.post(`${API}/api/v1/movies/users/login`, data);
  }

  register(data) {
    return axios.post(`${API}/api/v1/movies/users/register`, data);
  }
}

export default new MovieDataService();
