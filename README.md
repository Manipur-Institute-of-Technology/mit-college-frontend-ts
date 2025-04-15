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

- TailwindCSS, with headless UI that support tailwindCSS

### Contributors

To contribute follow the steaps as follows:

1. Create a fork of this repo.
2. Clone your forked repo to you device.
3. Configure your git, add the remote repository:
    ```bash
    git remote add upstream <src-repo-url>
    git remote add origin <forked-repo-url>
    ```
4. To make edit, create a local branch using your username: `git branch <username>`
5. After manually or using a unit test lib to test your code, commit the code to your local branch, (please, used conventional commit):
    ```bash
    git commit -m <username>
    git push origin <username>  # push commit to your forked repo branch
    ```
6. Then, submit a PR to merge with the `dev` branch

## Development Guidelines

### Rules - PR

- Do not commit/push/merge directly on `main/master` branch, used the `dev` branch
- `main/master` will be used for releasing only

### Code Style

- We use Prettier for code formatting
- Configure your editor to format on save

### Git Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code refactoring
- test: Adding/modifying tests
- chore: Build process or auxiliary tool changes

Example:

```
feat(auth): add user authentication endpoint
```

### Code Quality

- Run linting before commits:

```bash
npm run lint
```

- Run tests:

```bash
npm test
```

## License

Unlicensed

---

Built with ❤️ using React Router.
