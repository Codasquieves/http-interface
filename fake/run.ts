import "reflect-metadata";
import { FakeServer } from "./fake-server";

const port = parseInt(process.env.PORT ?? "3000", 10);

FakeServer.factory().listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening: http://localhost:${port}`);
});
