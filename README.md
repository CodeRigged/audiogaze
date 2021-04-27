# audiogaze

Audiogaze is a web-service which allows users to create and run trials by adding features not provided by [Gazepoints](https://www.gazept.com/) with their eye tracking device, such as allowing the user to play audio from specific channels.

## Table of Contents

- [Requirements](#requirements)
  - [Local Testing](#local-testing)
  - [Using Docker](#using-docker)
  - [Optional](#optional)
- [Installation & Setup](#installation-&-setup)
  - [With Docker](#with-docker)
  - [Local Development](#local-development)
- [Features](#features)
- [API](#api)
- [License](#license)

## Requirements

- [Gazepoint Eye Tracker & Control Software](https://www.gazept.com/downloads/)
  > Gazepoint Control Software is only supported on Windows

### Local Testing

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community?tck=docs_server)

### Using Docker

- [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)

#### Optional

- [Github](https://git-scm.com/download/win)

## Installation & Setup

> **NOTE:** make sure the Gazepoint Control Software is running

### With Docker

- Add your image- and audio-files in the [images](client/src/assets/images/README.md)- and in the [audio](client/src/assets/audio/README.md)-folder respectively
- Replace GAZEPOINT_ADDRESS' hashtags in environment-file of root folder with control address found in [Gazepoint Control Settings](assets/GazepointControlSettings.png) (when you are running the software)
- Run in command-shell and wait until everything is setup:

  ```console
  root/folder/of/project> docker-compose up
  ```

- Once you get the following message,
  open http://localhost:8080
  ```
  gazeaudio-server | Connected to database.
  ```

> **NOTE:** you can restart your application through Docker Desktop

### Local Development

- Add your image- and audio-files in a folder and edit the following variables in the [env-template](client/.env-template) file:

  ```
  VUE_APP_PATH_TO_IMAGES_FOLDER = /path/to/image/files/folder
  VUE_APP_PATH_TO_AUDIO_FOLDER = /path/to/audio/files/folder
  ```

- Install dependencies in server and client folder

  ```console
  folder/of/project/client> npm i
  folder/of/project/server> npm i
  ```

- Run following commands in two separate terminals:

  ```console
  root/folder/of/project> npm run client
  root/folder/of/project> npm run server
  ```

> Alternatively, you can run `npm run start` in server-folder and `npm run serve` in client-folder, also in two separate terminals

- Finally, open http://localhost:8080

### Features

- Adding trials
- Running trials
- Viewing trials
- Exporting results
- Removing trials

### API

> All requests start with `/api/v1`

#### Eyetracker

---

> `/eyetracker`

- **URLs**

  > `GET /connect`

  > `GET /disconnect`

  > `GET /data`

#### Trials

> `GET | POST /trials`

- **URLs**

  > `GET | PUT | DELETE /:id`

## License

[MIT](LICENSE)
