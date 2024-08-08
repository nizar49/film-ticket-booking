import { create } from "zustand";
import { persist } from "zustand/middleware";

const SeatManageStore = create(
  persist(
    (set) => ({
      seatsByProduct: {}, 
      confirmedSeatsByProduct: {}, 

      seatControl: (key, seat) =>
        set((state) => {
          const updatedTempSeats = state.seatsByProduct[key] || [];
          const updatedSeats = updatedTempSeats.includes(seat)
            ? updatedTempSeats.filter((s) => s !== seat)
            : [...updatedTempSeats, seat];

          return {
            seatsByProduct: {
              ...state.seatsByProduct,
              [key]: updatedSeats,
            },
          };
        }),

      confirmSeats: (key) =>
        set((state) => {
          const tempSeats = state.seatsByProduct[key] || [];
          const confirmedSeats = state.confirmedSeatsByProduct[key] || [];
          const updatedConfirmedSeats = [...confirmedSeats, ...tempSeats];

          return {
            confirmedSeatsByProduct: {
              ...state.confirmedSeatsByProduct,
              [key]: updatedConfirmedSeats,
            },
            seatsByProduct: {
              ...state.seatsByProduct,
              [key]: [],
            },
          };
        }),
        
        

      resetSeats: (key) =>
        set((state) => ({
          seatsByProduct: {
            ...state.seatsByProduct,
            [key]: [],
          },
        })),

      clearTempSeats: (key) =>
        set((state) => ({
          seatsByProduct: {
            ...state.seatsByProduct,
            [key]: [],
          },
        })),

      resetConfirmedSeats: (key) =>
        set((state) => ({
          confirmedSeatsByProduct: {
            ...state.confirmedSeatsByProduct,
            [key]: [],
          },
        })),
    }),
    {
      name: "seat-management-store", 
    }
  )
);

export default SeatManageStore;
