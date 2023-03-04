# Notakto
nonsense

# Usage
This repo consists of both server & client side sources. The entry point of which is hosted by the
server, [app.ts](./src/app.ts).

## Build Client
To transpile the client source code, run the following:
```sh
# Transpile Typescript -> Javascript + Static files (assets/css/html).
> npm run build:client
```

## Build & Run Server
To build/run this project, simply run the following:
```sh
# Transpile Typescript -> Javascript.
> npm run build:server

# Start the server.
> npm start

# For development - this will watch & transpile changes as well as rerun the server upon
# build completion.
> npm run start:dev
```

# License
Licensed under the [ISC License](./LICENSE).