import React, { Component } from "react";
import Logo from "../../img/white-logo.png";
import "../../styles/adminRegister.css";

export const AdminRegister = () => {
    return (
        <div className="container">
            <div className="left-container">
                <p className="text-center">
                    <img class="left-container-logo" src={Logo} />
                </p>
            </div>
            <div className="right-container">
                <h1 className="text-center">Register Account</h1>
                {/* <p>If you are already a member you can login with your email address and password.</p> */}
                <form>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" placeholder="Enter username" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter email" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Enter password" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" id="confirmPassword" placeholder="Re-enter password" required />
                    </div>
                    {/* <div className="mb-3">
                        <label htmlFor="projectName" className="form-label">Project Name</label>
                        <input type="text" className="form-control" id="projectName" placeholder="Enter project name" required />
                    </div>
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="Leave a description here" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">Enter project description</label>
                    </div> */}
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <button type="submit" className="btn">Register Account</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}


