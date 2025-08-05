import { createApiClient } from '@limlim-ai/core';

const apiClient = createApiClient(import.meta.env.VITE_BACKEND_API_URL);

export default apiClient; 