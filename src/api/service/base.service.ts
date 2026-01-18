import { IHttpAxiosClient } from "@/lib/axios";
import { PaginatedResponse } from "../types";

export abstract class BaseService<T extends { id: number | string }> {
  protected abstract readonly endpoint: string;

  constructor(protected api: IHttpAxiosClient) {}

  async getAll(
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, unknown>
  ): Promise<PaginatedResponse<T>> {
    return this.api.get<PaginatedResponse<T>>(this.endpoint, {
      params: {
        page,
        limit,
        ...filters,
      },
    });
  }

  async getById(id: number | string): Promise<T> {
    return this.api.get<T>(`${this.endpoint}/${id}`);
  }

  async create(data: Partial<Omit<T, 'id'>>): Promise<T> {
    return this.api.post<T>(this.endpoint, data);
  }

  async update(id: number | string, data: Partial<T>): Promise<T> {
    return this.api.put<T>(`${this.endpoint}/${id}`, data);
  }

  async patch(id: number | string, data: Partial<T>): Promise<T> {
    return this.api.patch<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: number | string): Promise<void> {
    await this.api.delete(`${this.endpoint}/${id}`);
  }

  async search(query: string, filters?: Record<string, unknown>): Promise<T[]> {
    return this.api.get<T[]>(`${this.endpoint}/search`, {
      params: {
        q: query,
        ...filters,
      },
    });
  }
}