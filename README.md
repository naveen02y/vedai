# Veda_AI

This is an AI assessment creator project built to help teachers generate papers and assignments easily using AI. the whole project is setup as a monorepo so we can manage both frontend and backend together.

## setup process

you need node.js, mongodb, and redis running on your machine.

1. clone the repo
2. install everything at once from the root folder:
   ```bash
   npm install
   ```
3. make sure you have your `.env` files setup in the `backend` (you need openai keys, mongo uri, redis host etc).
4. run the whole project with one command:
   ```bash
   npm run dev
   ```
   this uses concurrently to start the next.js frontend (port 3000) and the express backend (port 5001) at the same time.

to build for production, just run `npm run build` in the root.

## architecture overview

we split this into two main workspaces inside the monorepo:
- **frontend**: next.js (app router), tailwindcss for styling, zustand for state management. it connects to the backend via standard REST apis and uses socket.io-client to listen for real time updates.
- **backend**: node/express server. mongoose/mongodb stores all the assignment data. we also have a websocket server (socket.io) attached to express to push status events to the client.

## approach used

the main challenge with ai generation is that it takes a lot of time. if we just wait for the openai api call to finish synchronously, it blocks the thread and can crash the backend or timeout the frontend. 

to fix this, the approach I used was implementing a background job queue using **bullmq and redis**. 

here is how the core flow works:
1. user clicks create assignment on the frontend.
2. backend receives the request, saves a draft to mongodb with a `processing` status, and pushes a job to the redis queue.
3. the backend immediately responds with a success message so the frontend isn't left hanging.
4. a background worker picks up the job from redis, calls the openai api, and does the heavy lifting.
5. once openai returns the generated paper, the worker updates the mongodb document to `completed`.
6. finally, it fires a socket event back to the frontend to let the UI know the assignment is ready to view.

this keeps the ui feeling fast and the backend stable even under heavy load. for the frontend design, i went with a modern floating aesthetic with curved boxes and glassmorphism to make it look premium.
