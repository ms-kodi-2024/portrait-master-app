## Available scripts

To use the following commands, run them from the project root:

### `npm run start`
Runs both the server and client concurrently (dev mode).  
- Server runs on `http://localhost:8000`  
- Client runs on `http://localhost:3000`

### `npm run start:server`
Starts the Express server with auto-reload (`nodemon`).

### `npm run start:client`
Runs the React frontend (requires dependencies installed in `client/`).

### `npm run build`
Installs frontend dependencies and builds the React app into `client/build`.

### `npm run postinstall`
Used automatically after `npm install`; installs frontend dependencies.


## Security Summary

The app includes backend protections against form tampering, XSS, and vote abuse.

### Implemented protections

- Only image files (.jpg, .jpeg, .png, .gif) are accepted
- Title length max 25 characters; author max 50
- HTML tags are blocked in title, author, and email
- All fields are required; no submission allowed without file
- Votes can be cast only once per photo per IP (tracked in MongoDB)

### How to test

1. **Empty form**  
   Submit from frontend with no fields filled → error shown

2. **Missing file**  
   Use Postman, omit the `file` field → expect `Missing required fields`

3. **Invalid file type**  
   Use Postman, send `.txt` file as `file` → expect `Invalid file type`

4. **Long title**  
   Use Postman, send title longer than 25 chars → expect `Title is too long`

5. **HTML tags**  
   Use Postman, send `<h1>Bad</h1>` in title/author/email → expect `HTML tags are not allowed`

6. **Vote abuse**  
   - Like a photo in the UI
   - Remove `votes` from localStorage
   - Try liking again → expect `You already voted for this photo`

All validations are enforced on the server, regardless of client behavior.
