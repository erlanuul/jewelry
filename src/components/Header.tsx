import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications';
import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar,} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CachedIcon from '@mui/icons-material/Cached';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import {useSelector} from "react-redux";
import {accessRules} from "../http/MiddleWare";
import {CSSObject, styled, Theme} from '@mui/material/styles';
import {dispatch} from "../index";
import {logout} from "../store/slices/userSlice";
import LogoutIcon from '@mui/icons-material/Logout';


export const drawerWidth = 257;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 90, // Adjusted to 90px
    [theme.breakpoints.up('sm')]: {
        width: 90, // Adjusted to 90px for breakpoints up 'sm'
    },
});

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

function generateMenuItems(userPosition: string) {
    const menuItems = [
        {
            path: "/home",
            label: "Главная",
            icon:
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9 21V13.6C9 13.0399 9 12.7599 9.10899 12.546C9.20487 12.3578 9.35785 12.2049 9.54601 12.109C9.75992 12 10.0399 12 10.6 12H13.4C13.9601 12 14.2401 12 14.454 12.109C14.6422 12.2049 14.7951 12.3578 14.891 12.546C15 12.7599 15 13.0399 15 13.6V21M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76401C12.631 2.49076 12.4553 2.35413 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35413 11.369 2.49076 11.0177 2.76401Z"
                        stroke="#576ED0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/products",
            label: "Товары",
            icon:
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5.52 2.64L3.96 4.72C3.65102 5.13198 3.49652 5.33797 3.50011 5.51039C3.50323 5.66044 3.57358 5.80115 3.69175 5.89368C3.82754 6 4.08503 6 4.6 6H19.4C19.915 6 20.1725 6 20.3083 5.89368C20.4264 5.80115 20.4968 5.66044 20.4999 5.51039C20.5035 5.33797 20.349 5.13198 20.04 4.72L18.48 2.64M5.52 2.64C5.696 2.40533 5.784 2.288 5.89552 2.20338C5.9943 2.12842 6.10616 2.0725 6.22539 2.03845C6.36 2 6.50667 2 6.8 2H17.2C17.4933 2 17.64 2 17.7746 2.03845C17.8938 2.0725 18.0057 2.12842 18.1045 2.20338C18.216 2.288 18.304 2.40533 18.48 2.64M5.52 2.64L3.64 5.14666C3.40254 5.46328 3.28381 5.62159 3.1995 5.79592C3.12469 5.95062 3.07012 6.11431 3.03715 6.28296C3 6.47301 3 6.6709 3 7.06666L3 18.8C3 19.9201 3 20.4802 3.21799 20.908C3.40973 21.2843 3.71569 21.5903 4.09202 21.782C4.51984 22 5.07989 22 6.2 22L17.8 22C18.9201 22 19.4802 22 19.908 21.782C20.2843 21.5903 20.5903 21.2843 20.782 20.908C21 20.4802 21 19.9201 21 18.8V7.06667C21 6.6709 21 6.47301 20.9628 6.28296C20.9299 6.11431 20.8753 5.95062 20.8005 5.79592C20.7162 5.62159 20.5975 5.46328 20.36 5.14667L18.48 2.64M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/steels",
            label: "Металл",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.51562 11.0625H16.5312C16.5406 11.0625 16.5523 11.0625 16.5617 11.0602C16.6648 11.0437 16.7328 10.9477 16.7164 10.8445L15.7742 5.03203C15.7602 4.94062 15.6805 4.875 15.5891 4.875H9.45781C9.36641 4.875 9.28672 4.94062 9.27266 5.03203L8.33047 10.8445C8.32812 10.8539 8.32812 10.8656 8.32812 10.875C8.32812 10.9781 8.4125 11.0625 8.51562 11.0625ZM10.6531 6.46875H14.3914L14.8766 9.46875H10.1656L10.6531 6.46875ZM10.7117 13.0945C10.6977 13.0031 10.618 12.9375 10.5266 12.9375H4.39531C4.30391 12.9375 4.22422 13.0031 4.21016 13.0945L3.26797 18.907C3.26562 18.9164 3.26562 18.9281 3.26562 18.9375C3.26562 19.0406 3.35 19.125 3.45312 19.125H11.4688C11.4781 19.125 11.4898 19.125 11.4992 19.1227C11.6023 19.1063 11.6703 19.0102 11.6539 18.907L10.7117 13.0945ZM5.10547 17.5312L5.59062 14.5312H9.32891L9.81406 17.5312H5.10547ZM21.732 18.907L20.7898 13.0945C20.7758 13.0031 20.6961 12.9375 20.6047 12.9375H14.4734C14.382 12.9375 14.3023 13.0031 14.2883 13.0945L13.3461 18.907C13.3437 18.9164 13.3438 18.9281 13.3438 18.9375C13.3438 19.0406 13.4281 19.125 13.5312 19.125H21.5469C21.5562 19.125 21.568 19.125 21.5773 19.1227C21.6781 19.1063 21.7484 19.0102 21.732 18.907ZM15.1836 17.5312L15.6688 14.5312H19.407L19.8922 17.5312H15.1836Z"
                        fill="#6E6C6A"/>
                </svg>
        },
        {
            path: "/staffs",
            label: "Сотрудники",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.50002 21.8174C5.1026 22 5.91649 22 7.3 22H17.7C19.0835 22 19.8974 22 20.5 21.8174M4.50002 21.8174C4.37082 21.7783 4.25133 21.7308 4.13803 21.673C3.57354 21.3854 3.1146 20.9265 2.82698 20.362C2.5 19.7202 2.5 18.8802 2.5 17.2V6.8C2.5 5.11984 2.5 4.27976 2.82698 3.63803C3.1146 3.07354 3.57354 2.6146 4.13803 2.32698C4.77976 2 5.61984 2 7.3 2H17.7C19.3802 2 20.2202 2 20.862 2.32698C21.4265 2.6146 21.8854 3.07354 22.173 3.63803C22.5 4.27976 22.5 5.11984 22.5 6.8V17.2C22.5 18.8802 22.5 19.7202 22.173 20.362C21.8854 20.9265 21.4265 21.3854 20.862 21.673C20.7487 21.7308 20.6292 21.7783 20.5 21.8174M4.50002 21.8174C4.50035 21.0081 4.50521 20.5799 4.57686 20.2196C4.89249 18.6329 6.13288 17.3925 7.71964 17.0769C8.10603 17 8.57069 17 9.5 17H15.5C16.4293 17 16.894 17 17.2804 17.0769C18.8671 17.3925 20.1075 18.6329 20.4231 20.2196C20.4948 20.5799 20.4996 21.0081 20.5 21.8174M16.5 9.5C16.5 11.7091 14.7091 13.5 12.5 13.5C10.2909 13.5 8.5 11.7091 8.5 9.5C8.5 7.29086 10.2909 5.5 12.5 5.5C14.7091 5.5 16.5 7.29086 16.5 9.5Z"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/sales_reports",
            label: "Отчет по продажам",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.5 11H8.5M10.5 15H8.5M16.5 7H8.5M20.5 6.8V17.2C20.5 18.8802 20.5 19.7202 20.173 20.362C19.8854 20.9265 19.4265 21.3854 18.862 21.673C18.2202 22 17.3802 22 15.7 22H9.3C7.61984 22 6.77976 22 6.13803 21.673C5.57354 21.3854 5.1146 20.9265 4.82698 20.362C4.5 19.7202 4.5 18.8802 4.5 17.2V6.8C4.5 5.11984 4.5 4.27976 4.82698 3.63803C5.1146 3.07354 5.57354 2.6146 6.13803 2.32698C6.77976 2 7.61984 2 9.3 2H15.7C17.3802 2 18.2202 2 18.862 2.32698C19.4265 2.6146 19.8854 3.07354 20.173 3.63803C20.5 4.27976 20.5 5.11984 20.5 6.8Z"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/clients",
            label: "Клиенты",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M22.5 21V19C22.5 17.1362 21.2252 15.5701 19.5 15.126M16 3.29076C17.4659 3.88415 18.5 5.32131 18.5 7C18.5 8.67869 17.4659 10.1159 16 10.7092M17.5 21C17.5 19.1362 17.5 18.2044 17.1955 17.4693C16.7895 16.4892 16.0108 15.7105 15.0307 15.3045C14.2956 15 13.3638 15 11.5 15H8.5C6.63623 15 5.70435 15 4.96927 15.3045C3.98915 15.7105 3.21046 16.4892 2.80448 17.4693C2.5 18.2044 2.5 19.1362 2.5 21M14 7C14 9.20914 12.2091 11 10 11C7.79086 11 6 9.20914 6 7C6 4.79086 7.79086 3 10 3C12.2091 3 14 4.79086 14 7Z"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/debtors",
            label: "Должники",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.5 15H8.5C6.63623 15 5.70435 15 4.96927 15.3045C3.98915 15.7105 3.21046 16.4892 2.80448 17.4693C2.5 18.2044 2.5 19.1362 2.5 21M16 3.29076C17.4659 3.88415 18.5 5.32131 18.5 7M12.4999 21.5L14.525 21.095C14.7015 21.0597 14.7898 21.042 14.8721 21.0097C14.9452 20.9811 15.0147 20.9439 15.079 20.899C15.1516 20.8484 15.2152 20.7848 15.3426 20.6574L22 14C22.5524 13.4477 22.5523 12.5523 22 12C21.4477 11.4477 20.5523 11.4477 20 12L13.3425 18.6575C13.2152 18.7848 13.1516 18.8484 13.101 18.921C13.0561 18.9853 13.0189 19.0548 12.9902 19.1278C12.958 19.2102 12.9403 19.2984 12.905 19.475L12.4999 21.5ZM14 7C14 9.20914 12.2091 11 10 11C7.79086 11 6 9.20914 6 7C6 4.79086 7.79086 3 10 3C12.2091 3 14 4.79086 14 7Z"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/inventory_check",
            label: "Инвентаризация",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.5 20H5.7C4.57989 20 4.01984 20 3.59202 19.782C3.21569 19.5903 2.90973 19.2843 2.71799 18.908C2.5 18.4802 2.5 17.9201 2.5 16.8V7.2C2.5 6.07989 2.5 5.51984 2.71799 5.09202C2.90973 4.71569 3.21569 4.40973 3.59202 4.21799C4.01984 4 4.57989 4 5.7 4H6.1C8.34021 4 9.46031 4 10.316 4.43597C11.0686 4.81947 11.6805 5.43139 12.064 6.18404C12.5 7.03968 12.5 8.15979 12.5 10.4M12.5 20V10.4M12.5 20H19.3C20.4201 20 20.9802 20 21.408 19.782C21.7843 19.5903 22.0903 19.2843 22.282 18.908C22.5 18.4802 22.5 17.9201 22.5 16.8V7.2C22.5 6.07989 22.5 5.51984 22.282 5.09202C22.0903 4.71569 21.7843 4.40973 21.408 4.21799C20.9802 4 20.4201 4 19.3 4H18.9C16.6598 4 15.5397 4 14.684 4.43597C13.9314 4.81947 13.3195 5.43139 12.936 6.18404C12.5 7.03968 12.5 8.15979 12.5 10.4"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/box_office",
            label: "Касса",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.5 19V5C3.5 4.46957 3.71071 3.96086 4.08579 3.58579C4.46086 3.21071 4.96957 3 5.5 3H19.5C20.0304 3 20.5391 3.21071 20.9142 3.58579C21.2893 3.96086 21.5 4.46957 21.5 5V19C21.5 19.5304 21.2893 20.0391 20.9142 20.4142C20.5391 20.7893 20.0304 21 19.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19Z"
                        stroke="#6E6C6A" strokeWidth="1.5"/>
                    <path
                        d="M18.5 14V10M13 9.5L14 8.5M8 9.5L7 8.5M7 15.5L8 14.5M14 15.5L13 14.5M2.5 8H3.5M2.5 6H3.5M3.5 16H2.5M3.5 18H2.5M10.5 15C9.70435 15 8.94129 14.6839 8.37868 14.1213C7.81607 13.5587 7.5 12.7956 7.5 12C7.5 11.2044 7.81607 10.4413 8.37868 9.87868C8.94129 9.31607 9.70435 9 10.5 9C11.2956 9 12.0587 9.31607 12.6213 9.87868C13.1839 10.4413 13.5 11.2044 13.5 12C13.5 12.7956 13.1839 13.5587 12.6213 14.1213C12.0587 14.6839 11.2956 15 10.5 15Z"
                        stroke="#6E6C6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/expenses",
            label: "Расходы",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M22.5 10H2.5M11.5 14H6.5M2.5 8.2L2.5 15.8C2.5 16.9201 2.5 17.4802 2.71799 17.908C2.90973 18.2843 3.21569 18.5903 3.59202 18.782C4.01984 19 4.57989 19 5.7 19L19.3 19C20.4201 19 20.9802 19 21.408 18.782C21.7843 18.5903 22.0903 18.2843 22.282 17.908C22.5 17.4802 22.5 16.9201 22.5 15.8V8.2C22.5 7.0799 22.5 6.51984 22.282 6.09202C22.0903 5.7157 21.7843 5.40974 21.408 5.21799C20.9802 5 20.4201 5 19.3 5L5.7 5C4.5799 5 4.01984 5 3.59202 5.21799C3.2157 5.40973 2.90973 5.71569 2.71799 6.09202C2.5 6.51984 2.5 7.07989 2.5 8.2Z"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
        {
            path: "/salaries",
            label: "Зарплата",
            icon:
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.5 17C12.5 19.7614 14.7386 22 17.5 22C20.2614 22 22.5 19.7614 22.5 17C22.5 14.2386 20.2614 12 17.5 12C14.7386 12 12.5 14.2386 12.5 17ZM12.5 17C12.5 15.8742 12.8721 14.8353 13.5 13.9995V5M12.5 17C12.5 17.8254 12.7 18.604 13.0541 19.2901C12.2117 20.0018 10.2658 20.5 8 20.5C4.96243 20.5 2.5 19.6046 2.5 18.5V5M13.5 5C13.5 6.10457 11.0376 7 8 7C4.96243 7 2.5 6.10457 2.5 5M13.5 5C13.5 3.89543 11.0376 3 8 3C4.96243 3 2.5 3.89543 2.5 5M2.5 14C2.5 15.1046 4.96243 16 8 16C10.189 16 12.0793 15.535 12.9646 14.8618M13.5 9.5C13.5 10.6046 11.0376 11.5 8 11.5C4.96243 11.5 2.5 10.6046 2.5 9.5"
                        stroke="#6E6C6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
        },
    ];
    const rules = accessRules;

    return menuItems.filter((item: any) =>
        Array.from(new Set(rules[item.path])).some((elem: any) => {
            return elem.position === userPosition;
        })
    );
}

function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.userData.user)

    const menuItems = generateMenuItems(user?.position);

    const [open, setOpen] = React.useState(false);

    return (
        <Drawer
            variant="permanent"
            open={open}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <Toolbar/>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{display: 'block'}}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                padding: '0 20px 0 40px',
                            }}
                            selected={location.pathname.includes(item.path)}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} sx={{display: open ? 'block' : 'none'}}/>
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider/>
                <Toolbar/>
                <Divider/>
                <ListItem
                    disablePadding
                    sx={{display: 'block'}}
                    onClick={() => {
                        dispatch(logout())
                        window.location.reload()
                    }}
                >
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            padding: '0 20px 0 40px',
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <LogoutIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Выход'} sx={{display: open ? 'block' : 'none'}}/>
                    </ListItemButton>
                </ListItem>
            </List>
            <Toolbar/>
        </Drawer>
    );
}

export default Header;

