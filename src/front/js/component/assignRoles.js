import React, { Component } from "react";
import Logo from "../../img/white-logo.png";
import "../../styles/adminRegister.css";

export const AssignRoles = () => {
    return (
        <div className="container">
            <div className="left-container">
                <p className="text-center">
                    <img class="left-container-logo" src={Logo} />
                </p>
            </div>
            <div className="right-container">
                <h1 className="text-center">Assign Roles</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Enter username" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter email" required />
                    </div>
                </form>
            </div>
        </div>
    )
}


