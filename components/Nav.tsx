import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HideNavOnScroll from "./HideNavOnScroll";
import { useRouter } from "next/router";
import SignOut from "./SignOut";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import GolfCourseRoundedIcon from "@mui/icons-material/GolfCourseRounded";

const pages = ["New Round", "Profile", "My Clubs"];

function Nav() {
  const authContext = useAuthContext();
  const { isAuth, tokenPayload } = authContext.state;
  const router = useRouter();
  const { pathname } = router;
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const goToLoginOrRegister = (pathname: string) => {
    const page = pathname == "/login" ? "register" : "login";
    return router.push(`/${page}`);
  };

  function goToPage(page: string) {
    const safePage = page.replace(/\s/g, "-").toLocaleLowerCase();
    const safeUsername = tokenPayload?.username;
    handleCloseNavMenu();
    if (!safeUsername) {
      toast.error("Please login to create a new round");
      return router.push(`/login`);
    }
    if (safeUsername) {
      if (page == "New Round") {
        return router.push(`/${safeUsername}/round/${safePage}`);
      }
      return router.push(`/${safeUsername}/${safePage}`);
    }
    return router.push(`/login`);
  }

  return (
    <HideNavOnScroll>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <GolfCourseRoundedIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 800,
                letterSpacing: ".3rem",
                fontSize: "1.7rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              GOLF LOGS
            </Typography>

            {isAuth && (
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none", color: "black" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none", fontWeight: 700 },
                  }}
                >
                  {pages.map(page => (
                    <MenuItem key={page} onClick={() => goToPage(page)}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
            <GolfCourseRoundedIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 900,
                fontSize: "1.2rem",
                letterSpacing: ".3rem",
                color: "black",
                textDecoration: "none",
              }}
            >
              GOLF LOGS
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {isAuth &&
                pages.map(page => (
                  <Button
                    key={page}
                    onClick={() => goToPage(page)}
                    sx={{
                      my: 2,
                      color: "black",
                      display: "block",
                      fontSize: "1em",
                      fontWeight: 500,
                    }}
                  >
                    {page}
                  </Button>
                ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <>
                  {isAuth ? (
                    <SignOut />
                  ) : (
                    <IconButton
                      onClick={() => goToLoginOrRegister(pathname)}
                      sx={{ my: 2, display: "block" }}
                    >
                      <Typography variant="button" display="block" gutterBottom>
                        {pathname == "/login" ? "register" : "login"}
                      </Typography>
                    </IconButton>
                  )}
                </>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              ></Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideNavOnScroll>
  );
}
export default Nav;
