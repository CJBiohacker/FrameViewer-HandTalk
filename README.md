# FrameViewer

Este projeto foi desenvolvido com base em um desafio técnico elaborado pela empresa Hand Talk para o cargo de Desenvolvedor Full Stack II - (AI Unit - Community).
Consiste em uma aplicação Full Stack em que o usuário pode realizar o upload de um arquivo de vídeo (via seleção de input ou drag'n'drop), extrair os frames desse vídeo, listar todos os videos salvos numa tabela e, ao clicar em um botão, visualizar o conjunto de frames.

# Tecnologias

| Tecnologia | Versão  |
| ---------- | -------- |
| ReactJS    | 18.2.66  |
| Typescript | 5.2.2    |
| Vite       | 5.2.0    |
| NodeJS     | 20.11.30 |
| Express    | 4.19.2   |
| Firebase   | 10.9.0   |

# Pré-requisitos e Instalação

- Baixe ou defina a versão LTS do NodeJS (use o <a href="https://github.com/nvm-sh/nvm" target="_blank">Node Version Manager</a>) para instalar a versão correta).
- Clone este repositório.
- Abra o terminal bash no repositório, altere o caminho do diretório para `/Server` e execute o comando `npm i` ou `npm install` para instalar todos os pacotes do BackEnd.
- Altere o caminho do diretório para `/Community/frame-viewer` e execute o comando `yarn` ou `yarn install` para instalar todos os pacotes do FrontEnd.
- Após tudo instalado, inicie o servidor local executando o comando `npm start` no caminho `/Server`.
- Em seguida, inicie a aplicação Web executando o comando `yarn run dev` no caminho `/Community/frame-viewer`.

# Estrutura de Diretórios

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

# Como o Projeto funciona

O projeto atual adota uma estrutura modular, que incorpora elementos da arquitetura MVC (Model-View-Controller).<br>
Com as partes Controller e Model no caminho `/Server`, e a parte View na pasta `/Community`.
O Controller está localizado no caminho `/Server/src/controllers` contendo as principais funções que processam o vídeo, extraem e listam os frames, salva e consulta os metadados armazenados no banco de dados NoSQL do Firebase (Firestore Database).<br> Lembrando que os frames são salvos no Firebase Storage, o bucket que faz parte da plataforma de desenvolvimento do Firebase.
As rotas são todas definidas no caminho `/Server/src/routes` que será melhor especificado na seção `<a href="#restApi" >Instruções da REST API``</a>`.<br>
Você precisará criar um arquivo `.env` no caminho do diretório para `/Server`, onde passará os dados contidos na chave secreta `serviceAccount.json` que é gerada no console do Firebase. Clique no link abaixo:

<a href="https://drive.google.com/file/d/1xvW682dnC873xTPQHdWelTmNTFO6AoMe/view?usp=sharing" target="_blank">Image do local onde gerar uma chave privada no Firebase</a>

#### Definindo o arquivo .evnv:

```js
PORT=3001
FIREBASE_PROJECT_ID= <valor do project_id da sua chave secreta gerada>
FIREBASE_PRIVATE_KEY= <valor da private_key da sua chave secreta gerada>
FIREBASE_CLIENT_EMAIL= <valor da private_key da sua chave secreta gerada>

FIREBASE_TYPE= <valor do type da sua chave secreta gerada>
FIREBASE_PRIVATE_KEY_ID=<valor do private_key_id da sua chave secreta gerada>
FIREBASE_CLIENT_ID=<valor do client_id da sua chave secreta gerada>
FIREBASE_AUTH_URI=<valor do auth_uri da sua chave secreta gerada>
FIREBASE_TOKEN_URI=<valor do token_uri da sua chave secreta gerada>
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=<valor do auth_provider_x509_cert_url da sua chave secreta gerada>
FIREBASE_CLIENT_X509_CERT_URL=<valor do client_x509_cert_url da sua chave secreta gerada>
FIREBASE_UNIVERSE_DOMAIN=<valor do universe_domain da sua chave secreta gerada>

FIREBASE_STORAGE_BUCKET="gs://<nome da sua aplicação no firebase>.appspot.com"
FIREBASE_STORAGE_FOLDER=<nome da pasta criada no bucket>

FIRESTORE_DB_COLLECTION=<nome da collection criada no banco de dados noSQL>
```

#### Observações:

A conexão com o Firebase é realizada através do arquivo `/Server/src/database/firebaseConfig.ts`, onde montaremos o objeto `serviceAccount` que contém as credenciais importadas do arquivo `.env` para validar a conexão com o Firebase (Banco NoSQL e o Bucket):

```
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

O processamento do vídeo e extração dos frames ocorre no arquivo ` /Server/src/controllers/uploadController.ts`. No trecho de código mostrado abaixo, temos um `console.time` declarado tanto no processo de extração dos frames quanto no upload destes para o bucket, contabilizando o tempo para métricas de performance e desempenho.

```
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

No método `extractFrames` localizado no arquivo `/Server/utils/ffmpeg.ts` teremos o fluxo de extração dos frames retornando ao `uploadController` onde faremos o upload para o bucket, e em sequência os metadados do vídeo quer serão listados na aba de Listagem no Client-Side. Utilizaremos a biblioteca  <a href="https://www.npmjs.com/package/ffmpeg" target="_blank">ffmpeg</a> (<a href="https://ffmpeg.org/documentation.html" target="_blank">docs</a>) para executar este processo, conforme os passos abaixo:

* Criar uma pasta `/temp` dentro da pasta `temp` nativa do Sistema Operacional (Linux => `/tmp`, Windows => `/temp`)
* Salvar o arquivo dentro desta pasta /temp
* Executar o comando do ffmpeg para iniciar a extração dos frames (Configurei para 2 frames por segundo)
  * Podemos configurar modificando o valor do fps no script: `ffmpeg -i ${filePath} -vf fps=<nº de frames> ${tempDir}/frame-%04d.jpg`
* Criar uma estrutura de repetição nomeando cada frame com um número, para assim finalizar o processo de extração.
* Realizar o upload de cada frame para o Firebase Storage (bucket).
* Deletar a pasta `/temp` criada anteriormente com os frames, pra não acumular arquivos no servidor.
* Realizar o upload dos metadados do vídeo no Firestore Database (NoSQL), finalizando o processo.

Para resolver problemas de CORS ao solicitar o servidor, precisamos adicionar no arquivo `vite.config.js` um proxy para evitar problemas de concatenação de URL.
Portanto, lembre-se de especificar a URL do seu servidor no arquivo `/Community/frame-viewer/vite.config.js` no atributo `server.proxy.target` contido dentro da função `defineConfig`, conforme mostrado no código abaixo:

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
        target: <URL da API>,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

<h1 id="restApi" >Instruções da REST API</h1>

| Método HTTP | Endpoint             | Parâmetros            | Descrição                                                                                 |
| ------------ | -------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| `GET`      | `/list`            | `Nenhum`             | Requisição para buscar os metadados de todos os videos armazenados no banco NoSQL.        |
| `GET`      | `/list/frames/:id` | `videoId : string`  | Requisição para buscar os frames do video escolhido, armazenados no bucket.              |
| `POST`     | `/upload`          | `formData: formData` | Requisição para enviar o vídeo, extrair/salvar os frames e salvar os metadados do video. |
