import {
  getCurrentUser,
  updateProfile,
  login,
  register,
} from "@/src/shared/api";
import { UpdateProfileData, LoginData, RegisterData } from "../model/types";

export const userApi = {
  getProfile: getCurrentUser,
  updateProfile: (data: UpdateProfileData) => updateProfile(data),
  login: (data: LoginData) => login(data),
  register: (data: RegisterData) => register(data),
};
