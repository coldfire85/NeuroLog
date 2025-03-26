import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware to add security headers and handle authentication routing
 */
export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Define CSP - uncomment and adjust as needed for your security requirements
  const cspHeader = [
    // Default to only allowing content from same origin
    "default-src 'self'",
    // Scripts - allow same origin and inline scripts needed by Next.js
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    // Styles - allow same origin and inline styles
    "style-src 'self' 'unsafe-inline'",
    // Images - allow same origin, data URLs, and YouTube image servers
    "img-src 'self' data: blob: https://*.ytimg.com https://i.ytimg.com https://*.googleusercontent.com https://randomuser.me",
    // Fonts - allow same origin and data URLs
    "font-src 'self' data:",
    // Connect - allow same origin and API endpoints
    "connect-src 'self'",
    // Media - allow same origin and direct media links
    "media-src 'self' blob:",
    // Frames - carefully allow only YouTube for embeds
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    // Object sources - don't allow any
    "object-src 'none'",
    // Form actions - allow only same origin submissions
    "form-action 'self'",
  ].join('; ');

  // Add security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// Configure paths that should use the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API auth routes (which need to function without middleware)
     * - Static files and images
     * - Next.js internal routes
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
