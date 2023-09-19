import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Guest from "../layouts/Guest";
import Credits from "../pages/credits/Credits.jsx";
import Employees from "../pages/emplyees/Employees.jsx";
import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile.jsx";
import ReserveRoom from "../pages/reserveRoom/ReserveRoom.jsx";
import Rooms from "../pages/rooms/Rooms.jsx";
import SignIn from "../pages/signIn/SignIn.jsx";
import SignUp from "../pages/signUp/SignUp.jsx";
import Cleaner from '../pages/cleaner/Cleaner.jsx';
import CookPanel from '../pages/cookPanel/CookPanel.jsx';
import { getRoute } from "./routes.js";
import Receptionist from "../pages/receptionist/Receptionist";
import Doc from "../pages/doc/Doc";
const RouterSwitch = () => {
    return (
        <Routes>
            
            <Route
                path={getRoute('home').path}
                element={
                <Guest>
                    <Home/>
                </Guest>}
            />
            <Route
                path={getRoute('credits').path}
                element={
                <Guest>
                    <Credits/>
                </Guest>}
            />
            <Route
                path={getRoute('reserveRoom').path}
                element={
                <Guest>
                    <ReserveRoom/>
                </Guest>}
            />
            <Route
                path={getRoute('receptionist').path}
                element={
                <Guest>
                    <Receptionist/>
                </Guest>}
            />
            <Route
                path={getRoute('doc').path}
                element={
                <Guest>
                    <Doc/>
                </Guest>}
            />
            <Route
                path={getRoute('signIn').path}
                element={
                <Guest>
                    <SignIn/>
                </Guest>}
            />
            <Route
                path={getRoute('signUp').path}
                element={
                <Guest>
                    <SignUp/>
                </Guest>}
            />
            <Route
                path={getRoute('rooms').path}
                element={
                <Guest>
                    <Rooms/>
                </Guest>}
            />
            <Route
                path={getRoute('profile').path}
                element={
                <Guest>
                    <Profile/>
                </Guest>}
            />
            <Route
                path={getRoute('cleaner').path}
                element={
                <Guest>
                    <Cleaner/>
                </Guest>}
            />
            <Route
                path={getRoute('cook').path}
                element={
                <Guest>
                    <CookPanel/>
                </Guest>}
            />
            <Route
                path={getRoute("employees").path}
                element={
                <Guest>
                    <Employees />
                </Guest>}
            />
            <Route path="*" element={<Navigate to={getRoute("home").path} />} />
        </Routes>
    );
};

export default RouterSwitch;
