import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)', 
  '/',
  
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip middleware for public routes
  if (isPublicRoute(req)) return;
  
  // Authenticate other routes
  await auth().protect();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};