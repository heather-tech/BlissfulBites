import React from "react";
import { NavLink } from "react-router-dom";
import './nav.css'

function NavBar({ isLoggedIn }) { 
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-link">Home</NavLink>
            <NavLink to="/recipes" className="navbar-link">Find Recipes</NavLink>
            <NavLink to="/addrecipe" className="navbar-link">Add Recipe</NavLink>
            {isLoggedIn ? (
                <NavLink to="/user" className="navbar-link">Profile</NavLink>
            ) : (
                <div>
                    <NavLink to="/signup" className="navbar-link">Sign Up</NavLink>
                    <NavLink to="/login" className="navbar-link">Login</NavLink>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
