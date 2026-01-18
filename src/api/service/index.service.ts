import { api } from "@/lib/axios";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { ItemService } from "./item.service";

class ServiceFactory {
  private _authService: AuthService | null = null;
  private _userService: UserService | null = null;
  private _itemService: ItemService | null = null;

  get authService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService(api);
    }
    return this._authService;
  }

  get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService(api);
    }
    return this._userService;
  }

  get itemService(): ItemService {
    if (!this._itemService) {
      this._itemService = new ItemService(api);
    }
    return this._itemService;
  }
}

export const serviceFactory = new ServiceFactory();
export const authService = serviceFactory.authService;
export const userService = serviceFactory.userService;
export const itemService = serviceFactory.itemService;

export * from "./auth.service";
export * from "./user.service";
export * from "./item.service";