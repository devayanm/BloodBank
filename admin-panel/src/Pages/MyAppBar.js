import * as React from "react";
import { AppBar, UserMenu } from "react-admin";
import { Button } from "@mui/material";

const MyUserMenu = ({ onLogout, ...props }) => (
  <UserMenu {...props}>
    <Button color="inherit" onClick={onLogout} style={{ width: "100%" }}>
      Logout
    </Button>
  </UserMenu>
);

const MyAppBar = ({ onLogout, ...props }) => (
  <AppBar {...props} userMenu={<MyUserMenu onLogout={onLogout} />} />
);

export default MyAppBar;
