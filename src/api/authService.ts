import type { AxiosResponse } from "axios";
import apiClient from "./axios";
import type { IUserInfo } from "@/types";

interface IRegisterData {
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  password: string;
}

interface ILoginDate {
  username: string;
  password: string;
}

export const sendRegisterData = async (
  userData: IRegisterData,
): Promise<AxiosResponse> => {
  const response = await apiClient.post("/api/auth/users/", userData);
  return response;
};

export const login = async (userData: ILoginDate): Promise<AxiosResponse> => {
  const response = await apiClient.post("/api/auth/jwt/create/", userData);
  return response;
};

export const getCurrentUserData = async (): Promise<AxiosResponse<IUserInfo>> => {
  const response = await apiClient.get("/api/auth/users/me/");
  return response
}
