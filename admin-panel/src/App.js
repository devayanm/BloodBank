import React, { useState } from "react";
import { Admin, Resource } from "react-admin";
import dataProvider from "./dataProvider";
import LoginPage from "./Pages/LoginPage";
import { UserList, UserEdit, UserCreate } from "./Pages/users";
import {
  OrganDonorList,
  OrganDonorEdit,
  OrganDonorCreate,
} from "./Pages/organDonors";
import {
  BloodDonorList,
  BloodDonorEdit,
  BloodDonorCreate,
} from "./Pages/bloodDonors";
import MyAppBar from "./Pages/MyAppBar";
import MyLayout from "./Pages/MyLayout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Admin
      dataProvider={dataProvider}
      layout={(props) => (
        <MyLayout
          {...props}
          appBar={(props) => <MyAppBar {...props} onLogout={handleLogout} />}
        />
      )}
    >
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
      />
      <Resource
        name="organ-donors"
        list={OrganDonorList}
        edit={OrganDonorEdit}
        create={OrganDonorCreate}
      />
      <Resource
        name="blood-donors"
        list={BloodDonorList}
        edit={BloodDonorEdit}
        create={BloodDonorCreate}
      />
    </Admin>
  );
}

export default App;
