import model from "../models/index.js";
import {
  successResponse,
  clientErrorResponse,
  serverErrorResponse,
} from "../dto/response.js";
import { STATUS } from "../enum/Status.js";

const DeliveryPerson = model.DeliveryPerson;
const DeliveryPersonDocument = model.DeliveryPersonDocument;
const PickupPerson = model.PickupPerson;
const PickupPersonDocument = model.PickupPersonDocument;
const Restaurant = model.Restaurant;
const RestaurantDocument = model.RestaurantDocument;

export const getDeliveryPersonDocs = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json(clientErrorResponse("ID is required."));

    const document = await DeliveryPersonDocument.findOne({
      where: { deliveryPersonId: id },
    });
    if (!document)
      return res.status(404).json(clientErrorResponse("Document not found."));

    return res
      .status(200)
      .json(successResponse("Document fetched successfully.", document));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyDeliveryPersonDocument = async (req, res) => {
  try {
    const { personId } = req.params;
    const {
      userPictureStatus,
      userPictureReason,
      userDocumentStatus,
      userDocumentReason,
    } = req.body;

    if (!personId)
      return res
        .status(400)
        .json(clientErrorResponse("Person ID is required."));

    const allowedStatuses = [STATUS.APPROVED, STATUS.REJECTED];

    if (
      !allowedStatuses.includes(userPictureStatus) ||
      !allowedStatuses.includes(userDocumentStatus)
    ) {
      return res
        .status(400)
        .json(
          clientErrorResponse("Invalid status. Must be APPROVED or REJECTED."),
        );
    }

    const person = await DeliveryPerson.findByPk(personId);
    if (!person)
      return res
        .status(404)
        .json(clientErrorResponse("Delivery person not found."));

    const document = await DeliveryPersonDocument.findOne({
      where: { deliveryPersonId: personId },
    });
    if (!document)
      return res.status(404).json(clientErrorResponse("Document not found."));

    document.userPictureStatus = userPictureStatus;
    document.userPictureReason =
      userPictureStatus === STATUS.REJECTED
        ? (userPictureReason ?? null)
        : null;
    document.userDocumentStatus = userDocumentStatus;
    document.userDocumentReason =
      userDocumentStatus === STATUS.REJECTED
        ? (userDocumentReason ?? null)
        : null;
    await document.save();

    const hasRejected =
      userPictureStatus === STATUS.REJECTED ||
      userDocumentStatus === STATUS.REJECTED;

    if (hasRejected) {
      person.status = STATUS.REJECTED;
      await person.save();
      return res
        .status(200)
        .json(
          successResponse(
            "Documents verified. Delivery person marked as REJECTED.",
          ),
        );
    }

    const allApproved =
      userPictureStatus === STATUS.APPROVED &&
      userDocumentStatus === STATUS.APPROVED;

    if (allApproved) {
      person.status = STATUS.APPROVED;
      await person.save();
      return res
        .status(200)
        .json(
          successResponse(
            "All documents approved. Delivery person is now APPROVED.",
          ),
        );
    }

    return res
      .status(200)
      .json(successResponse("Documents verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getPickupPersonDocs = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json(clientErrorResponse("ID is required."));

    const document = await PickupPersonDocument.findOne({
      where: { pickupPersonId: id },
    });
    if (!document)
      return res.status(404).json(clientErrorResponse("Document not found."));

    return res
      .status(200)
      .json(successResponse("Document fetched successfully.", document));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyPickupPersonDocument = async (req, res) => {
  try {
    const { personId } = req.params;
    const {
      userPictureStatus,
      userPictureReason,
      userDocumentStatus,
      userDocumentReason,
      vehiclePictureStatus,
      vehiclePictureReason,
      vehicleDocumentStatus,
      vehicleDocumentReason,
    } = req.body;

    if (!personId)
      return res
        .status(400)
        .json(clientErrorResponse("Person ID is required."));

    const allowedStatuses = [STATUS.APPROVED, STATUS.REJECTED];

    if (
      !allowedStatuses.includes(userPictureStatus) ||
      !allowedStatuses.includes(userDocumentStatus) ||
      !allowedStatuses.includes(vehiclePictureStatus) ||
      !allowedStatuses.includes(vehicleDocumentStatus)
    ) {
      return res
        .status(400)
        .json(
          clientErrorResponse("Invalid status. Must be APPROVED or REJECTED."),
        );
    }

    const person = await PickupPerson.findByPk(personId);
    if (!person)
      return res
        .status(404)
        .json(clientErrorResponse("Pickup person not found."));

    const document = await PickupPersonDocument.findOne({
      where: { pickupPersonId: personId },
    });
    if (!document)
      return res.status(404).json(clientErrorResponse("Document not found."));

    document.userPictureStatus = userPictureStatus;
    document.userPictureReason =
      userPictureStatus === STATUS.REJECTED
        ? (userPictureReason ?? null)
        : null;
    document.userDocumentStatus = userDocumentStatus;
    document.userDocumentReason =
      userDocumentStatus === STATUS.REJECTED
        ? (userDocumentReason ?? null)
        : null;
    document.vehiclePictureStatus = vehiclePictureStatus;
    document.vehiclePictureReason =
      vehiclePictureStatus === STATUS.REJECTED
        ? (vehiclePictureReason ?? null)
        : null;
    document.vehicleDocumentStatus = vehicleDocumentStatus;
    document.vehicleDocumentReason =
      vehicleDocumentStatus === STATUS.REJECTED
        ? (vehicleDocumentReason ?? null)
        : null;
    await document.save();

    const hasRejected =
      userPictureStatus === STATUS.REJECTED ||
      userDocumentStatus === STATUS.REJECTED ||
      vehiclePictureStatus === STATUS.REJECTED ||
      vehicleDocumentStatus === STATUS.REJECTED;

    if (hasRejected) {
      person.status = STATUS.REJECTED;
      await person.save();
      return res
        .status(200)
        .json(
          successResponse(
            "Documents verified. Pickup person marked as REJECTED.",
          ),
        );
    }

    const allApproved =
      userPictureStatus === STATUS.APPROVED &&
      userDocumentStatus === STATUS.APPROVED &&
      vehiclePictureStatus === STATUS.APPROVED &&
      vehicleDocumentStatus === STATUS.APPROVED;

    if (allApproved) {
      person.status = STATUS.APPROVED;
      await person.save();
      return res
        .status(200)
        .json(
          successResponse(
            "All documents approved. Pickup person is now APPROVED.",
          ),
        );
    }

    return res
      .status(200)
      .json(successResponse("Documents verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const getRestaurantDocs = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json(clientErrorResponse("ID is required."));

    const document = await RestaurantDocument.findOne({
      where: { restaurantId: id },
    });
    if (!document)
      return res.status(404).json(clientErrorResponse("Document not found."));

    return res
      .status(200)
      .json(successResponse("Document fetched successfully.", document));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};

export const verifyRestaurantDocument = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const {
      userPictureStatus,
      userPictureReason,
      userDocumentStatus,
      userDocumentReason,
      restaurantDocumentStatus,
      restaurantDocumentReason,
    } = req.body;

    if (!restaurantId)
      return res
        .status(400)
        .json(clientErrorResponse("Restaurant ID is required."));

    const allowedStatuses = [STATUS.APPROVED, STATUS.REJECTED];

    if (
      !allowedStatuses.includes(userPictureStatus) ||
      !allowedStatuses.includes(userDocumentStatus) ||
      !allowedStatuses.includes(restaurantDocumentStatus)
    ) {
      return res
        .status(400)
        .json(
          clientErrorResponse("Invalid status. Must be APPROVED or REJECTED."),
        );
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant)
      return res.status(404).json(clientErrorResponse("Restaurant not found."));

    const document = await RestaurantDocument.findOne({
      where: { restaurantId },
    });
    if (!document)
      return res.status(404).json(clientErrorResponse("Document not found."));

    document.userPictureStatus = userPictureStatus;
    document.userPictureReason =
      userPictureStatus === STATUS.REJECTED
        ? (userPictureReason ?? null)
        : null;
    document.userDocumentStatus = userDocumentStatus;
    document.userDocumentReason =
      userDocumentStatus === STATUS.REJECTED
        ? (userDocumentReason ?? null)
        : null;
    document.restaurantDocumentStatus = restaurantDocumentStatus;
    document.restaurantDocumentReason =
      restaurantDocumentStatus === STATUS.REJECTED
        ? (restaurantDocumentReason ?? null)
        : null;
    await document.save();

    const hasRejected =
      userPictureStatus === STATUS.REJECTED ||
      userDocumentStatus === STATUS.REJECTED ||
      restaurantDocumentStatus === STATUS.REJECTED;

    if (hasRejected) {
      restaurant.status = STATUS.REJECTED;
      await restaurant.save();
      return res
        .status(200)
        .json(
          successResponse("Documents verified. Restaurant marked as REJECTED."),
        );
    }

    const allApproved =
      userPictureStatus === STATUS.APPROVED &&
      userDocumentStatus === STATUS.APPROVED &&
      restaurantDocumentStatus === STATUS.APPROVED;

    if (allApproved) {
      restaurant.status = STATUS.APPROVED;
      await restaurant.save();
      return res
        .status(200)
        .json(
          successResponse(
            "All documents approved. Restaurant is now APPROVED.",
          ),
        );
    }

    return res
      .status(200)
      .json(successResponse("Documents verified successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(serverErrorResponse("Something went wrong. Please try again."));
  }
};
