import { Server } from "socket.io";
import model from "./src/models/index.js";

const TrainLocation = model.TrainLocation;
const PickupPersonLocation = model.PickupPersonLocation;

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    // Train driver shares location
    socket.on(
      "train_location_update",
      async ({ scheduleId, latitude, longitude }) => {
        await TrainLocation.upsert({
          scheduleId,
          latitude,
          longitude,
          isActive: true,
        });
        io.to(`train_${scheduleId}`).emit("train_location", {
          latitude,
          longitude,
          isActive: true,
        });
      },
    );

    // User tracks train
    socket.on("track_train", (scheduleId) => {
      socket.join(`train_${scheduleId}`);
    });

    // Pickup person shares location
    socket.on(
      "pickup_location_update",
      async ({ pickupPersonId, latitude, longitude }) => {
        await PickupPersonLocation.upsert({
          pickupPersonId,
          latitude,
          longitude,
        });
        io.to(`pickup_${pickupPersonId}`).emit("pickup_location", {
          latitude,
          longitude,
        });
      },
    );

    // User tracks pickup person
    socket.on("track_pickup", (pickupPersonId) => {
      socket.join(`pickup_${pickupPersonId}`);
    });

    socket.on("disconnect", () => {
      console.log("disconnected", socket.id);
    });
  });

  return io;
};
