import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial, { SpeedDialProps } from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SaveIcon from "@mui/icons-material/Save";
import SignalCellularConnectedNoInternet1BarRoundedIcon from "@mui/icons-material/SignalCellularConnectedNoInternet1BarRounded";
import CellWifiRoundedIcon from "@mui/icons-material/CellWifiRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const actions = [
  { icon: <CellWifiRoundedIcon />, name: "Offline Mode" },
  { icon: <EditRoundedIcon />, name: "Edit Round Info" },
];

export default function EditRoundMenu() {
  // TODO toggle offline mode icon
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
        {actions.map(action => (
          <SpeedDialAction
            sx={{ mx: 2 }}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
