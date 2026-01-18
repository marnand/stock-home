/**
 * Tipos e Interfaces comuns para requisições HTTP
 * Alinhado com API (api/src/types/index.ts)
 * Convenção: snake_case para consistência com banco de dados (sem necessidade de mapping)
 */

import { AxiosResponse } from "axios";

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  retry?: boolean;
  cache?: boolean;
}

export interface ResponseMeta {
  statusCode: number;
  timestamp: string;
}

export interface ApiResponse<T> extends AxiosResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  code?: string;
  meta?: ResponseMeta;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  total_pages?: number;
  success: boolean;
}

/**
 * Tipos de domínio - Item do Inventário
 * Campos em português (pt-BR) com snake_case para consistência com banco de dados
 */
export interface Item {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  quantidade_atual: number;
  quantidade_minima: number;
  unidade_medida: string;
  valor_unitario: number;
  data_validade?: string;
  data_ultima_compra?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

/**
 * Tipos de domínio - Usuário
 */
export interface User {
  id: string;
  email: string;
  nome: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Tipos de domínio - Autenticação
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterData extends LoginCredentials {
  nome: string;
}

/**
 * Tipos de domínio - Item da Lista de Compras
 */
export interface ShoppingListItem {
  id: string;
  nome: string;
  quantidade: number;
  unidade_medida?: string;
  concluido: boolean;
  created_at: string;
  updated_at: string;
  user_id?: string;
}
