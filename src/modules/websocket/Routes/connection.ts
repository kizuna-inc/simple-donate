import { Server } from "socket.io";

export const socketConnection = async (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`hi! ${socket.id}`);

    // socket.on(`${process.env.ROOM_NAME || "simple-donate"}_screen`, (msg) => {
    //   console.log(msg);
    // });

    socket.on("disconnect", () => {
      console.log(`goodbye, ${socket.id}`);
      console.log("");
    });
  });
};
