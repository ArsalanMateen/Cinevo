# Cinevo API

The Cinevo server is an Express and MongoDB API for browsing the sample_mflix movie catalog, retrieving movie details and reviews, authenticating the existing demo user, and creating author-scoped review updates and deletions.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Return application health |
| GET | `/api/v1/movies/` | List movies with pagination, title, genre, and sort controls |
| GET | `/api/v1/movies/id/:id` | Retrieve a movie with its reviews |
| GET | `/api/v1/movies/genres` | List available movie genres |
| POST | `/api/v1/movies/users/login` | Validate an existing user |
| POST | `/api/v1/movies/reviews` | Create a review |
| PUT | `/api/v1/movies/reviews` | Update an author-matching review |
| DELETE | `/api/v1/movies/reviews` | Delete an author-matching review |

## Local setup

Install dependencies from the server directory:

```bash
cd server
npm install
```

Create `server/.env`:

```text
CINEVO_DB_URI=your-mongodb-atlas-connection-string
CINEVO_NS=sample_mflix
PORT=8000
```

Start the API with `node index.js`. The repository also contains a Render blueprint; its database URI remains an externally supplied secret.
