// Next.js instrumentation hook - runs once when the server starts
// Used to warm up caches before the first request

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import dynamically to avoid issues during build
    const { preloadVisualizerCache } = await import('../src/web/visualizer-service')
    
    // Warm up the visualizer cache in the background
    // Don't await - we don't want to block server startup
    preloadVisualizerCache().catch(() => {
      // Silently ignore preload errors
    })
  }
}
