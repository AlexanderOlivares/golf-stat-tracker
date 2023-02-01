import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SignalCellularConnectedNoInternet1BarRoundedIcon from "@mui/icons-material/SignalCellularConnectedNoInternet1BarRounded";
import CellWifiRoundedIcon from "@mui/icons-material/CellWifiRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNetworkContext } from "../context/NetworkContext";

export default function EditRoundMenu() {
  const networkContext = useNetworkContext();
  const { offlineModeEnabled } = networkContext.state;

  function toggleOfflineMode() {
    networkContext.dispatch({
      type: "update offline mode enabled",
      payload: {
        ...networkContext.state,
        offlineModeEnabled: !networkContext.state.offlineModeEnabled,
      },
    });
  }

  return (
    <Box sx={{ height: 60 }}>
      <SpeedDial
        ariaLabel="SpeedDial playground example"
        hidden={true}
        icon={<SpeedDialIcon />}
        direction={"right"}
        open={true}
        sx={{ justifyContent: "center" }}
      >
        <SpeedDialAction
          sx={{ mx: 2 }}
          key={"Offline Mode"}
          icon={
            offlineModeEnabled ? (
              <SignalCellularConnectedNoInternet1BarRoundedIcon />
            ) : (
              <CellWifiRoundedIcon />
            )
          }
          tooltipTitle={"Offline Mode"}
          onClick={toggleOfflineMode}
        />
        {/* <SpeedDialAction
          sx={{ mx: 2 }}
          key={"Edit Round Info"}
          icon={<EditRoundedIcon />}
          tooltipTitle={"Edit Round Info"}
          onClick={}
        /> */}
      </SpeedDial>
    </Box>
  );
}
