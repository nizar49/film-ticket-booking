import axios from "axios";
import { baseUrl } from "../basicurl/baseurl";
import Cookies from "js-cookie";

export const verifyUser = async () => {
  try {
    const response = await axios.get(`${baseUrl}/users/verifyUser`, {
      withCredentials: true,
    });
    if (response.status === 200 ) {
      return { isAuthenticated: true };
    } else {
      throw new Error("User not authenticated");
    }
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
};

export const verifyGtoken = async () => {
  try {
    const result = await axios.post(
      `${baseUrl}/users/googleLogin`, 
      {},
      {
        withCredentials: true,
      }
    );

    if (result.status !== 200) {
      throw new Error("Token is invalid");
    }

    const decode = result.data.decode;
    let profileArray = JSON.parse(Cookies.get("profileArray") || "[]");
    profileArray.push(decode);
    Cookies.set("profileArray", JSON.stringify(profileArray));
    Cookies.set("profile", JSON.stringify(decode));
    
    const event = new Event("profileUpdated");
    window.dispatchEvent(event);
    
    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
