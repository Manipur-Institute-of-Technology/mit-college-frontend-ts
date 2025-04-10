# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Starting up the frontend application

Before, you `npm run dev` the frontend app, make sure you start the backend api server, or else it will configured the routes without the user defined routes.
Route to fetched user defined routes from the backend api should be defined in `app.config.env` env file. Here, is a [sample env file](#env-file-sample) to start working

#### Development

If you are working on user defined routed specifically start the backend api first before running the frontend, otherwise you can run the frontend without the configured routes.
For quick testing, you can used the `server/server.js` to start a mock server.

#### Production

- Build: Start the backend api first before running the frontend, then build it

#### ENV file sample

```env
# API endpoint for routes
ROUTE_API_URL=http://localhost:3001/api/routes   # Route from which the user define routes will be fetched, it'll be served from backend
REACT_APP_ENV=development
NODE_ENV=development
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
