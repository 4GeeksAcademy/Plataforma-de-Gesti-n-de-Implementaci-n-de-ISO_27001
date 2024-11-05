import React, { useState } from 'react';
import Logo from "../../img/white-logo.png";


const FormProject = () => {


    return (
        <div className="container">
            <div className="left-container">
                <p className="text-center">
                    <img className="left-container-logo" src={Logo} />
                </p>
            </div>
            <div className="right-container">
                <h1 className="text-center">Register Project</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="projectName" className="form-label">Project Name</label>
                        <input type="text" className="form-control" id="projectName" placeholder="Enter Project Name" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="companyName" className="form-label">Company Name</label>
                        <input type="text" className="form-control" id="companyName" placeholder="Enter Company Name" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="projectDescription" className="form-label">Project Description</label>
                        <textarea type="textarea" className="form-control" id="projectDescription" placeholder="Enter Project Description" required />
                    </div>
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <button type="submit" className="btn">Register Project</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormProject;