import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Custom logic if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // API routes protection
        if (pathname.startsWith("/api")) {
          // Public API routes
          const publicApiRoutes = [
            "/api/auth",
            "/api/properties",
            "/api/agents", 
            "/api/blog",
            "/api/swagger"
          ]
          
          // Check if it's a public route
          const isPublicRoute = publicApiRoutes.some(route => 
            pathname.startsWith(route)
          )

          // Protected API routes that require authentication
          const protectedApiRoutes = [
            { path: "/api/properties", methods: ["POST", "PUT", "DELETE"], role: "AGENT" },
            { path: "/api/agents", methods: ["POST", "PUT", "DELETE"], role: "ADMIN" },
            { path: "/api/blog", methods: ["POST", "PUT", "DELETE"], role: "AGENT" },
          ]

          // Check protected routes
          for (const route of protectedApiRoutes) {
            if (pathname.startsWith(route.path)) {
              // Need to check method and role
              if (!token) return false
              if (route.role === "ADMIN" && token.role !== "ADMIN") return false
              if (route.role === "AGENT" && !["AGENT", "ADMIN"].includes(token.role as string)) return false
            }
          }
        }

        // Page routes protection
        if (pathname.startsWith("/dashboard")) {
          return !!token
        }

        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }

        return true
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/:path*",
  ]
}