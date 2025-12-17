// Ultraviolet Service Worker
class UVServiceWorker {
  constructor() {
    this.config = self.__uv$config || {
      prefix: '/uv/service/',
      bare: 'https://uv.holyubofficial.net/'
    };
  }

  async fetch(event) {
    const url = new URL(event.request.url);
    
    if (url.pathname.startsWith(this.config.prefix)) {
      // Extract the actual URL from the proxied path
      const actualUrl = decodeURIComponent(
        url.pathname.slice(this.config.prefix.length)
      );

      try {
        // Fetch through bare server
        const response = await fetch(this.config.bare + actualUrl, {
          method: event.request.method,
          headers: event.request.headers,
          body: event.request.body
        });

        return response;
      } catch (error) {
        console.error('UV fetch error:', error);
        return new Response('Proxy error', { status: 500 });
      }
    }

    return fetch(event.request);
  }
}

// Make UVServiceWorker available globally
self.UVServiceWorker = UVServiceWorker;
