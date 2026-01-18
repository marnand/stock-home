import { IHttpAxiosClient } from "@/lib/axios";
import { Item } from "../types";
import { BaseService } from "./base.service";

export class ItemService extends BaseService<Item> {
  protected readonly endpoint = '/items';
  
  constructor(protected api: IHttpAxiosClient) {
    super(api);
  }
}