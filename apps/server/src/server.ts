import { createApp} from "./app";

const PORT=4000;

const app = createApp();

app.listen(PORT, () => {
    console.log("Server running");
});