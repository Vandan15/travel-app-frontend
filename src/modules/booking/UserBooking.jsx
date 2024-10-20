import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { CANCEL_BOOKING } from "../auth/graphql/mutations";
import { GET_BOOKINGS_BY_USER } from "../auth/graphql/queries";

export default function UserBooking() {
  const { data, loading, refetch } = useQuery(GET_BOOKINGS_BY_USER, {
    notifyOnNetworkStatusChange: true,
  });
  const [deleteBookingMutate, { loading: deleteBookingLoading }] =
    useMutation(CANCEL_BOOKING);

  const [currentBooking, setCurrentBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  console.log(data);

  const handleCancelBooking = () => {
    deleteBookingMutate({
      variables: {
        data: {
          id: currentBooking,
        },
      },
      onCompleted: (res) => {
        toast.success(res?.cancelUserBooking?.message);
        setShowModal(false);
        refetch();
      },
    });
  };

  if (!loading) {
    return (
      <div className="user-booking">
        <h2 className="title">Your Bookings</h2>
        {data?.userBookings?.userBookings?.length === 0 ? (
          <div className="mt-3">No bookings found</div>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Check In (DD/MM/YYYY)</th>
                  <th>Check Out (DD/MM/YYYY)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.userBookings.userBookings?.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking?.hotel?.name}</td>
                    <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setShowModal(true);
                          setCurrentBooking(booking?.id);
                        }}
                      >
                        Cancel Booking
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Cancel Booking</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to cancel this booking?
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  disabled={deleteBookingLoading}
                >
                  Close
                </Button>
                <Button
                  variant="danger"
                  onClick={handleCancelBooking}
                  disabled={deleteBookingLoading}
                >
                  Cancel Booking
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    );
  }
}
