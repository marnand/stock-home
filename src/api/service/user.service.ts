import { IHttpAxiosClient } from "@/lib/axios";
import { User } from "../types";

const USER_API_URL = "/users";

export class UserService {
  constructor(private api: IHttpAxiosClient) {}

}