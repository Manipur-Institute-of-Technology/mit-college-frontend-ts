import * as React from "react";

const AdminContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "login": {
      localStorage.setItem("userId", action.id);
      localStorage.setItem("token", action.token);
      return {
        ...state,
        AdminId: action.id,
        AdminToken: action.token,
        error: null,
      };
    }
    case "logout": {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      return { ...state, AdminId: "", AdminToken: "", error: null };
    }
    case "loadUserData": {
      return {
        ...state,
        AdminToken: action.token,
        AdminId: state.userId,
      };
    }
    case "nonetwork": {
      return { ...state, error: "No Network Connection" };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AdminStorage() {
  const context = React.useContext(AdminContext);
  if (context === undefined) {
    throw new Error("context not found");
  }
  return context;
}

function AdminProvider({ children }) {
  const [state, dispatch] = React.useReducer(userReducer, {
    AdminId: localStorage.getItem("AdminId") || "",
    AdminToken: localStorage.getItem("token") || "",
    error: null,
  });

  const value = { state, dispatch };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export { AdminProvider, AdminStorage };
