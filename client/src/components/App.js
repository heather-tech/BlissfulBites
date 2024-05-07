import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SignupForm from "./User/SignupForm";
import NavBar from "./NavBar";
import Login from "./User/Login";
import Recipes from "./Recipes/Recipes";
import SavedRecipes from "./Recipes/SavedRecipes";
import ProfilePage from "./User/ProfilePage";
import AddRecipe from "./Recipes/AddRecipe";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Resets isLoggedIn state to false when logging out
    setIsLoggedIn(false); 
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/savedrecipes" element={<SavedRecipes />} />
        <Route path="/addrecipe" element={<AddRecipe />} />
        <Route
          path="/signup"
          element={<SignupForm onSignUpSuccess={handleLogin} />}
        />
        <Route 
          path="/login" 
          element={<Login 
          onLoginSuccess={() => setIsLoggedIn(true)} />} />

        <Route path="/user" element={<ProfilePage onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
