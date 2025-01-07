import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: "absolute",
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

const actions = [
  {
    icon: <DeleteOutlinedIcon />,
    name: "Delete",
    onClick: () => alert("Delete clicked!"),
  },
  {
    icon: <EditIcon />,
    name: "Edit",
    onClick: () => alert("Edit clicked!"),
  },
];

export default function PlaygroundSpeedDial() {
  return (
    <div style={{ height: "200vh" }}>
      <Box
        sx={{ transform: "translateZ(0px)", flexGrow: 1 }}
        className="fixed-bottom"
      >
        <Box sx={{ position: "relative", mt: 3, height: 320 }}>
          <StyledSpeedDial
            ariaLabel="SpeedDial playground example"
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </StyledSpeedDial>
        </Box>
      </Box>
    </div>
  );
}
