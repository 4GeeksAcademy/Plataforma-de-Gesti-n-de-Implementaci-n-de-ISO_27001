import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Login } from  "./pages/login";
import injectContext from "./store/appContext";

import { Register} from "./component/register";
import { ManageUsers } from "./component/manageUsers";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { ProjectList } from "./pages/projectList";
import { FormProject } from "./component/formProject";
import { Sidebar } from "./component/sidebar";
import { Main } from "./pages/main";
import { ResetPassword } from  "./pages/resetPassword";
import { ChangePassword } from "./pages/changePassword";
import { Profile } from "./pages/profile";
import { Help } from "./pages/help";
import { ZoomAuthorized } from "./pages/ZoomAuthorized";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register"/>
                        <Route element={<Main />} path="/main/*"/>
                        <Route element={<ManageUsers />} path="/manage/users"/>
                        <Route element={<ProjectList />} path ="/projectlist"/>
                        <Route element={<FormProject />} path="/addproject" />
                        <Route element={<ResetPassword />} path="/reset-password"/>
                        <Route element={<ChangePassword />} path="/change-password" />
                        <Route element={<Main />} path="/main/:projectId/*" />
                        <Route path="/zoom-authorized" element={<ZoomAuthorized />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/help" element={<Help />} />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
