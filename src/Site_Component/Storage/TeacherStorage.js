import * as React from "react";

const TeacherContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "login": {
      localStorage.setItem("TeacherId", action.id);
      localStorage.setItem("token", action.token);
      return {
        ...state,
        TeacherId: action.id,
        TeacherToken: action.token,
        error: null,
      };
    }
    case "logout": {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      return { ...state, TeacherId: "", TeacherToken: "", error: null };
    }
    case "loadUserData": {
      return {
        ...state,
        TeacherToken: action.token,
        TeacherId: state.userId,
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

function TeacherStorage() {
  const context = React.useContext(TeacherContext);
  if (context === undefined) {
    throw new Error("context not found");
  }
  return context;
}

function TeacherProvider({ children }) {
  const [state, dispatch] = React.useReducer(userReducer, {
    TeacherId: localStorage.getItem("TeacherId") || "",
    TeacherToken: localStorage.getItem("token") || "",
    error: null,
  });

  const value = { state, dispatch };
  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
}

export { TeacherProvider, TeacherStorage };
