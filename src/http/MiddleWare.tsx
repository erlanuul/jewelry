import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


export const accessRules: any = {
    "/home": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/products": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/steels": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/staffs": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/sales_reports": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/clients": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/debtors": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/inventory_check": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/box_office": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/expenses": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],
    "/salaries": [
        {
            position: "Frontend - разработчик",
            privileges: {
                add: true,
                edit: true,
                delete: true,
            },
        },
    ],



};

const MiddleWare = ({ children }: any) => {
    const location = useLocation();
    const userData = useSelector((state: any) => state.userData);
    const isOnLoginPage = location.pathname.includes("login");

    if (userData.authed) {
        if (isOnLoginPage) {
            return <Navigate to="/home" replace />; // Redirect logged-in users on the login page to the home page.
        }
        if (location.pathname === "/") {
            return <Navigate to="/home" replace />;
        }

        // Iterate over the keys (page names) in accessRules.
        for (const pageName in accessRules) {
            if (location.pathname.includes(pageName)) {
                const allowedRoles = accessRules[pageName];
                if (
                    allowedRoles.some((role: any) =>
                        role.position.includes(userData.user?.position)
                    )
                ) {
                    return children; // Allow access to the page.
                } else {
                    return <Navigate to="/denied-permission" replace />;
                }
            }
        }

        // If there is no match in accessRules, allow access.
        return children;
    }

    if (!userData.authed && !isOnLoginPage) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default MiddleWare;
