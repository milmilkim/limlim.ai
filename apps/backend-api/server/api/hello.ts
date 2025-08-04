import type { HelloResponse } from '@limlim-ai/shared'

export default eventHandler((): HelloResponse => {
  return {
    message: 'Hello from Nitro!',
  }
}) 