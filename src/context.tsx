import React, { createContext, useEffect, useState } from "react";
import API from "./API";
import { useCookies } from "react-cookie";

type Props = {
  children: React.ReactNode;
};

type UserData = {
  sessionId: string;
  userName: string;
  accountId: string;
};

export const initUserData: UserData = {
  sessionId: "",
  userName: "",
  accountId: "",
};

export const UserContext = createContext<any>(null);

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserData>(initUserData);
  const [cookies, setCookie, removeCookie] = useCookies([
    "userName",
    "sessionId",
    "accountId",
  ]);

  // useEffect(() => {
  //   if (!cookies.userName && !cookies.sessionId && !cookies.accountId) {
  //     API.getAccountDetails(cookies.sessionId).then((data) => {
  //       if (
  //         data?.status_code !== 3 &&
  //         data?.username === cookies.userName &&
  //         data?.id.toString() === cookies.accountId
  //       ) {
  //         setUser({
  //           sessionId: cookies.sessionId,
  //           userName: cookies.userName,
  //           accountId: cookies.accountId,
  //         });
  //       } else {
  //         setUser(initUserData);
  //         removeCookie("userName");
  //         removeCookie("sessionId");
  //         removeCookie("accountId");
  //       }
  //     });
  //   }
  // }, [cookies]);

  const isAuth = !!cookies.userName || !!user.userName;
  const data = {
    isAuth,
    setUser,
    cookies,
    setCookie,
    removeCookie,
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
export default UserProvider;
