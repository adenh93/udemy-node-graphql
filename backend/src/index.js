import "dotenv/config";
import server from "./server";

server.start(() => {
  console.log("GraphQL server is running");
});
