import * as dotenv from "dotenv";

import swaggerUi from "swagger-ui-express"
import swaggerDoc from "./docs/swagger.json"
import { createServer } from './express.server'

dotenv.config()
const port = process.env.PORT
const app = createServer()

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.listen(port, () => {
    console.log(`API está rodando na porta ${port} `);
});
