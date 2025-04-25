import { useUserStore } from "@/stores/user";

export function logInUser(Username: string, Password: string) {
    return {success: true, message: "Logged in successfully"}
}

export function logOutUser() {
    return {success: true, message: "Logged out successfully"}
}