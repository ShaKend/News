import express, {Request, Response} from "express";

const app = express();
const port = 5001;

app.get('/', (req: Request, res: Response) => {
    res.send('This server is running!');
});

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});