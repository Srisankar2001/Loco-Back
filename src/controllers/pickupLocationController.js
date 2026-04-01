import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";

const PickupPersonLocation = model.PickupPersonLocation;
const PickupPerson = model.PickupPerson;

// User | Get last known pickup person location
export const getPickupPersonLocation = async (req, res) => {
  try {
    const { pickupPersonId } = req.params;
    if (!pickupPersonId) {
      return res.status(400).json(clientErrorResponse("Pickup Person ID is required."));
    }

    const pickupPerson = await PickupPerson.findByPk(pickupPersonId);
    if (!pickupPerson) {
      return res.status(400).json(clientErrorResponse("Pickup person not found."));
    }

    const location = await PickupPersonLocation.findOne({ where: { pickupPersonId } });
    if (!location) {
      return res.status(400).json(clientErrorResponse("No location found."));
    }

    return res.status(200).json(successResponse("Location fetched successfully.", location));
  } catch (error) {
    return res.status(500).json(serverErrorResponse("Something went wrong. Please try again."));
  }
};