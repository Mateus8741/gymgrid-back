import { fastify } from "fastify";

const app = fastify();

app.listen({ port: 3100, host: "0.0.0.0" }).then(() => {
    console.log("Server is running on port 3000");
});