import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Router from "next/router";

interface IShowBackdrop {
  showBackdrop: boolean;
}

export default function LoadingBackdrop({ showBackdrop }: IShowBackdrop) {
  const [open, setOpen] = React.useState(showBackdrop);
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    Router.events.on("routeChangeStart", () => setOpen(true));
    Router.events.on("routeChangeComplete", () => setOpen(false));
    return () => {
      Router.events.on("routeChangeStart", () => setOpen(true));
      Router.events.on("routeChangeComplete", () => setOpen(false));
    };
  }, []);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
