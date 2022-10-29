import React from "react";
import ClubSelectChip from "../../components/ClubSelectChip";
import { ProfileContextProvider } from "../../context/userProfileContext";

export var defaultClubs = [
  "Driver",
  "3 wood",
  "4 hybrid",
  "4 iron",
  "5 iron",
  "6 iron",
  "7 iron",
  "8 iron",
  "9 iron",
  "Pitching Wedge",
  "52 degree",
  "56 degree",
  "58 degree",
  "60 degree",
  "putter",
  "3 hybrid",
  "7 wood",
  "5 wood",
  "1 iron",
  "2 iron",
  "3 iron",
  "50 degree",
  "54 degree",
  "62 degree",
  "64 degree",
];

export default function EditProfile() {
  return (
    <>
      <ProfileContextProvider>
        <h1>EditProfile</h1>
        <h3>Build your bag</h3>
        <ClubSelectChip />
      </ProfileContextProvider>
    </>
  );
}
