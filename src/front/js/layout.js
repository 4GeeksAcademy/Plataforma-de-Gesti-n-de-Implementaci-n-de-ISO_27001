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
                        {/*/<Route element={<Sidebar />} path="/sidebar">*/}
                        <Route element={<div> <h1>Dominios</h1> <Outlet></Outlet> </div>} path="/sidebar">
                            <Route path="contexto" element={<h2>Contexto</h2>}/>
                            <Route path="liderazgo" element={<h2>Liderazgo</h2>} />
                        </Route>
                        <Route element={<ManageUsers />} path="/manage/users"/>
                        <Route element={<ProjectList />} path ="/projectlist"/>
                        <Route element={<FormProject />} path="/addproject" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
