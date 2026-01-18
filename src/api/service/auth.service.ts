import { IHttpAxiosClient } from "@/lib/axios"
import { LoginResponse, RegisterData, User } from "../types"

const AUTH_API_PATH = '/auth'

export class AuthService {
  constructor(private api: IHttpAxiosClient) { }

  login = async (email: string, password: string): Promise<LoginResponse> => {
    return this.api.post(`${AUTH_API_PATH}/login`, { email, password })
  }

  logout = async (): Promise<void> => {
    return this.api.post(`${AUTH_API_PATH}/logout`)
  }

  signup = async (data: RegisterData): Promise<LoginResponse> => {
    return await this.api.post<LoginResponse>(`${AUTH_API_PATH}/signup`, data);
  }

  getCurrent = async (): Promise<User | null> => {
    return this.api.get<User>(`${AUTH_API_PATH}/me`);
  }
}

