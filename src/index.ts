import App from "./rotas/app.js"

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3005;;

const server = new App()

server.app.listen(PORT, () => console.log(`Server is Running ${PORT}`))