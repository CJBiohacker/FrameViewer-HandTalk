# FrameViewer

Developed for a Hand Talk technical challenge for the position of Full Stack Developer II - (AI Unit - Community).
FrameViewer is a Full Stack application that allows users to upload a video file (via input selection or drag'n'drop), extract the frames from the video, list all saved videos in a table, and view the set of frames by clicking a button.

# Technologies

| Technology | Version  |
| ---------- | -------- |
| ReactJS    | 18.2.66  |
| Typescript | 5.2.2    |
| Vite       | 5.2.0    |
| NodeJS     | 20.11.30 |
| Express    | 4.19.2   |
| Firebase   | 10.9.0   |

# Pre-requisites and Installation

- Download or set the LTS version of NodeJS (use it the <a href="https://github.com/nvm-sh/nvm" target="_blank">Node Version Manager</a>) to install the correct version.
- Clone this repository.
- Open a bash terminal in the repository, change the directory path to `/Server`, and execute the command `npm i` or `npm install` to install all the backend packages.
- Change the directory path to `/Community/frame-viewer` and execute the command `yarn` or `yarn install` to install all the frontend packages.
- Once everything is installed, start the local server by executing the command `npm start` in the `/Server` directory.
- Then, start the web application by executing the command `yarn run dev` in the `/Community/frame-viewer` directory.

## Directory Structure

```txt
+---Community
|   +---frame-viewer
|   |   +---src
|   |      +---components
|   |         +---Shared
|   |      +---fonts
|   |      +---routes
|   |      +---styles
|   |      +---types
|   |      +---utils
|   |         App.tsx
|   |         main.tsx
|   |         vite-env.d.ts
|   .eslintrc.js
|   .gitignore
|   index.html
|   postcss.config.js
|   tailwind.config.js
|   package.json
|   .tsconfig.json
|   .tsconfig.node.json
|   vite.config.js
|   yarn.lock
+---Server
|   +---src
|   |   +---controllers
|   |   +---database
|   |   +---routes
|   |   +---secret
|   |   +---types
|   |   +---utils
|   |   app.ts
|   |   nodemon.json
|   .env (file created by the developer)
|   package.json
|   package-lock.json
|   .tsconfig.json
.gitignore
README.md

```

# How the Project Works

The current project adopts a modular structure, incorporating elements of the MVC (Model-View-Controller) architecture.<br>
With the Controller and Model parts in the `/Server` path, and the View part in the `/Community` folder.
The Controller is located in the `/Server/src/controllers` path containing the main functions that process the video, extract and list the frames, save and query the metadata stored in the Firebase NoSQL database (Firestore Database).<br>

Note that the frames are saved in Firebase Storage, the bucket that is part of the Firebase development platform.
The routes are all defined in the `/Server/src/routes` path, which will be better specified in the <a href="#restApi" >REST API Instructions</a> section.<br>

You will need to create a `.env` file in the directory path to `/Server`, where you will pass the data contained in the secret key `serviceAccount.json` generated in the Firebase console. Click on the link below:

<a href="https://drive.google.com/file/d/1xvW682dnC873xTPQHdWelTmNTFO6AoMe/view?usp=sharing" target="_blank">Image of where to generate a private key in Firebase</a>

#### Defining the .env file

```js
PORT=3001
FIREBASE_PROJECT_ID= <value of the project_id from your generated secret key>
FIREBASE_PRIVATE_KEY= <value of the private_key from your generated secret key>
FIREBASE_CLIENT_EMAIL= <value of the client_email from your generated secret key>

FIREBASE_TYPE= <value of the type from your generated secret key>
FIREBASE_PRIVATE_KEY_ID=<value of the private_key_id from your generated secret key>
FIREBASE_CLIENT_ID=<value of the client_id from your generated secret key>
FIREBASE_AUTH_URI=<value of the auth_uri from your generated secret key>
FIREBASE_TOKEN_URI=<value of the token_uri from your generated secret key>
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=<value of the auth_provider_x509_cert_url from your generated secret key>
FIREBASE_CLIENT_X509_CERT_URL=<value of the client_x509_cert_url from your generated secret key>
FIREBASE_UNIVERSE_DOMAIN=<value of the universe_domain from your generated secret key>

FIREBASE_STORAGE_BUCKET="gs://<your application name in firebase>.appspot.com"
FIREBASE_STORAGE_FOLDER=<name of the folder created in the bucket>

FIRESTORE_DB_COLLECTION=<name of the collection created in the NoSQL database>
```

#### Notes

The connection to Firebase is made through the `/Server/src/database/firebaseConfig.ts` file, where we will assemble the `serviceAccount` object that contains the credentials imported from the `.env` file to validate the connection to Firebase (NoSQL Database and the Bucket):

```js
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  type: process.env.FIREBASE_TYPE,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};
```

The video processing and frame extraction occur in the `/Server/src/controllers/uploadController.ts` file. In the code snippet shown below, we have a console.time declared both in the frame extraction process and in uploading them to the bucket, counting the time for performance and efficiency metrics.

```js
console.time("extractFramesTime");
const frames = await extractFrames(file.buffer, videoId);
console.timeEnd("extractFramesTime");
  
console.time("uploadFramesTime");
for (const frame of frames) {
 const destination = `${process.env.FIREBASE_STORAGE_FOLDER}/${videoId}/${frame.name}`;
        await uploadFrameToStorage(frame, destination);
}   
console.timeEnd("uploadFramesTime");
```

In the `extractFrames` method located in the `/Server/utils/ffmpeg.ts` file, we will have the frame extraction flow returning to uploadController where we will upload it to the bucket, and subsequently the video metadata that will be listed in the Listing tab on the Client-Side. We will use the <a href="https://www.npmjs.com/package/ffmpeg" target="_blank">ffmpeg</a> (<a href="https://ffmpeg.org/documentation.html" target="_blank">docs</a>) library to execute this process, following the steps below:

    - Create a `/temp` folder inside the native temp folder of the Operating System (Linux => /tmp, Windows => /temp)
    - Save the file inside this `/temp` folder
    - Run the ffmpeg command to start frame extraction (Configured for 2 frames per second)
        - We can configure by modifying the fps value in the script: `ffmpeg -i${filePath} -vf fps=<frame number> ${tempDir}/frame-%04d.jpg`
    - Create a loop structure naming each frame with a number, to finish the extraction process.
    - Upload each frame to Firebase Storage (bucket).
    - Delete the `/temp` folder created earlier with the frames, so as not to accumulate files on the server.
    - Upload the video metadata to the Firestore Database (NoSQL), completing the process.

To resolve CORS issues when requesting the server, we need to add a proxy in the `vite.config.js` file to avoid URL concatenation issues.
Therefore, remember to specify the URL of your server in the `/Community/frame-viewer/vite.config.js` file in the `server.proxy.target` attribute contained within the `defineConfig` function, as shown in the code below:

```js
export default defineConfig({
    ...
    ...
    ...
    ,
    server: {
    port: 5173,
    proxy: {
      "/api": {
        target: <API URL>,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

<h1 id="restApi" >REST API Instructions</h1>

| HTTP Method  | Endpoint             | Parameters            | Description                                                                                 |
| ------------ | -------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| `GET`      | `/list`            | `None`             | Request to fetch the metadata of all videos stored in the NoSQL database.        |
| `GET`      | `/list/frames/:id` | `videoId : string`  | Request to fetch the metadata of all videos stored in the NoSQL database.              |
| `POST`     | `/upload`          | `formData: formData` | Request to fetch the frames of the chosen video, stored in the bucket. |
