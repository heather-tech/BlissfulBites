import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import './nav.css';


function NavBar() { 
    const user = useSelector(state => state.users.user);
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-link">Home</NavLink>
            <NavLink to="/recipes" className="navbar-link">Find Recipes</NavLink>
            {user && <NavLink to="/addrecipe" className="navbar-link">Add Recipe</NavLink>}
            {/* {user && <NavLink to="/savedrecipes" className="navbar-link">Favorited</NavLink>} */}
            {user ? (
                <NavLink to="/user" className="navbar-link">Profile</NavLink>
            ) : (
                <React.Fragment>
                    <NavLink to="/signup" className="navbar-link">Sign Up</NavLink>
                    <NavLink to="/login" className="navbar-link">Login</NavLink>
                </React.Fragment>
            )}
        </nav>
    );
}

export default NavBar;
