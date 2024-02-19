/*eslint-disable react/prop-types */
import moment from "moment-timezone";

import { getCorrectDate } from "../helpers/userHelperFunctions";
import Button from "./Button";
import toast from "react-hot-toast";
import { useState } from "react";
import { deleteReservationById } from "../helpers/reservationHelpers";

const ReservationCard = ({ reservation, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    villaName,
    reservedDates: { startDate, endDate },
    villaPicture,
    userTimezone,
    totalPrice,
    paymentMethod,
    numberGuests,
    reservationId,
  } = reservation;

  const arrivalFullDate = getCorrectDate(new Date(startDate), userTimezone);
  const departureFullDate = getCorrectDate(new Date(endDate), userTimezone);
  const arrivalFormated = moment(arrivalFullDate).format("MM-D-Y");
  const departureFormated = moment(departureFullDate).format("MM-D-Y");

  const handleCancelReservation = async (id) => {
    setIsLoading(true);
    await deleteReservationById(id).then((data) => {
      if (data.status === 200) {
        onCancel(id);
        setIsLoading(false);
        return toast.success("Reservation canceled");
      }
      if (data.success === false) {
        setIsLoading(false);
        return toast.error("There was a problem canceling your reservation");
      }
    });
  };

  return (
    <div className="reservation-card-container">
      <h2>{villaName}</h2>
      <div className="reservation-card-information">
        <img src={villaPicture} alt="" />
        <div className="reservation-card-information-wrapper">
          <p>Arrival: {arrivalFormated}</p>
          <p>Departure: {departureFormated}</p>
          <p>Expecting {numberGuests} guests</p>
          <p>
            Payment:{" "}
            {paymentMethod === "cash" ? "On arrival" : "Payed with card"}
          </p>
          <p>Total price: {totalPrice}$</p>
        </div>
      </div>
      <div className="button-wrapper">
        <Button
          isLoading={isLoading}
          isLoadingMsg="Canceling..."
          onClick={async () => await handleCancelReservation(reservationId)}
        >
          Cancel reservation
        </Button>
      </div>
    </div>
  );
};

export default ReservationCard;
