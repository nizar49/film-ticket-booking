import { Button, CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { baseUrl } from "../basicurl/baseurl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/themeContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 5,
};

export default function RazorPay({
  price,
  totalReservation,
  movie,
  theater,
  seetNumbers,
  date,
  time,
  location,
  handlepay,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mode } = useTheme();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePayLater = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post(
        `${baseUrl}/payments/payLater`,
        {
          movieName: movie,
          theaterName: theater,
          seatNumbers: seetNumbers,
          date,
          time,
          location,
          totalReservation,
          price,
          mode: "payLater",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          handlepay();
          handleClose();
          toast.success(response.data.message);
          navigate("/user/dashboard");
        }, 1000);
      } else {
        throw new Error("Failed to pay later");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Book Tickets");
      setLoading(false);
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    
    if (!window.Razorpay) {
      console.error("Razorpay SDK is not loaded");
      toast.error("Failed to load payment gateway.");
      return;
    }
  
    try {
      const response = await axios.post(`${baseUrl}/payments/razorpay/order`, {
        amount: price,
      });
  
      const order = response.data.data;
  
      const options = {
        key: "rzp_test_54hIf49p1a39tZ",
        amount: price,
        currency: order.currency,
        name: "RazorPay",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${baseUrl}/payments/razorpay/verify`,
              {
                razorpay_order_id: order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                movieName: movie,
                theaterName: theater,
                seatNumbers: seetNumbers,
                date,
                time,
                location,
                totalReservation,
                price,
                mode: "paid",
              },
              { withCredentials: true }
            );
            handlepay();
            handleClose();
            toast.success("Payment successful. A confirmation email has been sent. Please check your inbox.");
            navigate("/user/dashboard");
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Failed to Verify Payment");
          }
        },
        prefill: {
          name: "Ramees",
          email: "rameesta555@gmail.com",
          contact: "6238339877",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#0f0f8d",
        },
      };
  
      const rzp1 = new window.Razorpay(options);
  
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
      });
  
      rzp1.open();
    } catch (error) {
      console.error("Error in payment process:", error);
      toast.error("Failed to Book Tickets");
    }
  };
  
  return (
    <>
      <div >
        <Button onClick={handleOpen} variant="contained" sx={{ 
          fontWeight: "bold" ,
          backgroundColor: mode === "dark"? "#2b3b94" : "#2b3b94",
          color:"#fff",
          borderColor: mode === "dark"? "#212121" : "#ffffff",
          transition: "all 0.5s ease ",
          "&:hover": {
            backgroundColor: mode === "dark"? "#2b3b94" : "#2b3b94",
            color:"#fff",
            borderColor: mode === "dark"? "#212121" : "#ffffff",
            transform: "scale(1.04)",
          }
          
          }}>
          Proceed to payment
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography>Payment Options?</Typography>
            <Stack direction="row" spacing={3} mt={5}>
              <Button
                variant="contained"
                onClick={handlePayment}
                sx={{
                  color: "#000",
                  backgroundColor: "#18cf46",
                  borderColor: "#0e9c32",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#0e9c32",
                    borderColor: "#18cf46",
                  },
                }}
              >
                Pay Now
              </Button>
              <Button
                onClick={handlePayLater}
                variant="outlined"
                sx={{
                  color: "#fa7305",
                  fontWeight: "bold",
                  borderColor: "#fa7305",
                  "&:hover": {
                    color: "#fa7305",
                    borderColor: "#fa7305",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: mode === "dark" ? "white" : "black" }}
                  />
                ) : (
                  "Pay Later"
                )}
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </>
  );
}
