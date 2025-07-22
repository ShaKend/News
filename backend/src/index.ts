import express, {Request, Response} from "express";
import cors from "cors";
import userRoute from "./routes/UserRoute";
import favoriteRoute from "./routes/FavoriteRoute";

require('dotenv').config();
const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(express.json());
app.use(cors())

// API
app.use('/api/user', userRoute);
app.use('/api/favorite', favoriteRoute);

app.get('/', (req: Request, res: Response) => {
    res.send('This server is running!');
});

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});







// Execute this in Supabase when create a new table
// CREATE POLICY "Allow full access to table_name"
// ON schema_name.table_name
// FOR ALL
// USING (true);