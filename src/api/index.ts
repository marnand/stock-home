/**
 * Barril de exportação da API
 * Exporta clientes, repositórios, tipos e hooks
 */

// Configuração
export { API_CONFIG, HTTP_STATUS } from './config';

// Erros
export { ApiError, NetworkError, ValidationError } from './errors/ApiError';
export type { ApiErrorResponse } from './errors/ApiError';

// Tipos
export * from './types';

// Hooks
export * from './hooks';
