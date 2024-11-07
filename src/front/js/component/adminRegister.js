import React, { Component, useContext } from "react";
import { Context } from "../store/appContext";
import Logo from "../../img/white-logo.png";
import "../../styles/adminRegister.css";

export const AdminRegister = () => {

    const {store, actions} = useContext(Context)
    async function submitForm(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const full_name = formData.get("full_name")
        const email = formData.get("email")
        const password = formData.get("password")
        const project_name = formData.get("project_name")
        if (!full_name || !email || !password || !project_name) {
            console.log("Incomplete data")
            return 
        }
        let success = await actions.registerInitialAdmin(full_name, email, password, project_name)
        if(success) {
            console.log("Admin registered")
        }
        else {
            console.log("Error while registering admin")
        }
    }
    return (
        <div className="container">
            <div className="left-container">
                <p className="text-center">
                    <img className="left-container-logo" src={Logo} />
                </p>
            </div>
            <div className="right-container">
                <h1 className="text-center">Register Account</h1>
                <form onSubmit={submitForm}>
                    <div className="mb-3">
                        <label htmlFor="full_name" className="form-label">Full Name</label>
                        <input type="text" className="form-control" name="full_name" placeholder="Enter full name" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" className="form-control" name="email" placeholder="Enter email" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" placeholder="Enter password" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="project_name" className="form-label">Project Name</label>
                        <input type="string" className="form-control" name="project_name" placeholder="Enter project name" required />
                    </div>
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


