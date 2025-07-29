export const getApiDocs = () => {
  return {
      openapi: '3.0.0',
      info: {
        title: 'PropertyFinder API',
        version: '1.0.0',
        description: 'API documentation for PropertyFinder real estate platform\n\n## Authentication\n\nThis API uses NextAuth.js for authentication. Some endpoints require authentication with specific roles:\n- **USER**: Basic user role for favorites and inquiries\n- **AGENT**: Can create, update, and delete their own properties\n- **ADMIN**: Full access to all resources\n\nTo authenticate in Swagger:\n1. Sign in to the application via `/auth/signin`\n2. The session cookie will be automatically used for requests\n3. For manual testing, you can use the bearer token from the session',
      },
      servers: [
        {
          url: typeof window !== 'undefined' 
            ? window.location.origin 
            : (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
          description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token from NextAuth session'
          },
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'next-auth.session-token',
            description: 'NextAuth session cookie'
          }
        },
        schemas: {
          Property: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              title: { type: 'string' },
              location: { type: 'string' },
              price: { type: 'string' },
              area: { type: 'string' },
              image: { type: 'string' },
              bedrooms: { type: 'integer' },
              bathrooms: { type: 'integer' },
              rating: { type: 'number' },
              featured: { type: 'boolean' },
              amenities: {
                type: 'array',
                items: { type: 'string' }
              },
              description: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          PropertyInput: {
            type: 'object',
            required: ['title', 'location', 'price', 'area', 'image', 'bedrooms', 'bathrooms', 'description'],
            properties: {
              title: { type: 'string' },
              location: { type: 'string' },
              price: { type: 'string' },
              area: { type: 'string' },
              image: { type: 'string' },
              bedrooms: { type: 'integer' },
              bathrooms: { type: 'integer' },
              rating: { type: 'number', default: 0 },
              featured: { type: 'boolean', default: false },
              amenities: {
                type: 'array',
                items: { type: 'string' },
                default: []
              },
              description: { type: 'string' },
            },
          },
          Agent: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              title: { type: 'string' },
              image: { type: 'string' },
              rating: { type: 'number' },
              reviewCount: { type: 'integer' },
              soldProperties: { type: 'integer' },
              yearsExperience: { type: 'integer' },
              languages: {
                type: 'array',
                items: { type: 'string' }
              },
              specialties: {
                type: 'array',
                items: { type: 'string' }
              },
              phone: { type: 'string' },
              email: { type: 'string' },
              bio: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          AgentInput: {
            type: 'object',
            required: ['name', 'title', 'image', 'yearsExperience', 'phone', 'email', 'bio'],
            properties: {
              name: { type: 'string' },
              title: { type: 'string' },
              image: { type: 'string' },
              rating: { type: 'number', default: 0 },
              reviewCount: { type: 'integer', default: 0 },
              soldProperties: { type: 'integer', default: 0 },
              yearsExperience: { type: 'integer' },
              languages: {
                type: 'array',
                items: { type: 'string' },
                default: []
              },
              specialties: {
                type: 'array',
                items: { type: 'string' },
                default: []
              },
              phone: { type: 'string' },
              email: { type: 'string' },
              bio: { type: 'string' },
            },
          },
          BlogPost: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              slug: { type: 'string' },
              excerpt: { type: 'string' },
              content: { type: 'string' },
              image: { type: 'string' },
              author: { type: 'string' },
              authorAvatar: { type: 'string' },
              date: { type: 'string', format: 'date-time' },
              readTime: { type: 'string' },
              category: { type: 'string' },
              tags: {
                type: 'array',
                items: { type: 'string' }
              },
              views: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          BlogPostInput: {
            type: 'object',
            required: ['title', 'slug', 'excerpt', 'content', 'image', 'author', 'authorAvatar', 'date', 'readTime', 'category'],
            properties: {
              title: { type: 'string' },
              slug: { type: 'string' },
              excerpt: { type: 'string' },
              content: { type: 'string' },
              image: { type: 'string' },
              author: { type: 'string' },
              authorAvatar: { type: 'string' },
              date: { type: 'string', format: 'date-time' },
              readTime: { type: 'string' },
              category: { type: 'string' },
              tags: {
                type: 'array',
                items: { type: 'string' },
                default: []
              },
              views: { type: 'integer', default: 0 },
            },
          },
          Inquiry: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string', nullable: true },
              message: { type: 'string' },
              propertyId: { type: 'integer', nullable: true },
              agentId: { type: 'integer', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          AuthCredentials: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
            },
          },
          SignUpRequest: {
            type: 'object',
            required: ['email', 'password', 'name'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 6 },
              name: { type: 'string' },
              role: { type: 'string', enum: ['USER', 'AGENT'], default: 'USER' },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
              role: { type: 'string', enum: ['USER', 'AGENT', 'ADMIN'] },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      tags: [
        {
          name: 'Authentication',
          description: 'User authentication and registration',
        },
        {
          name: 'Properties',
          description: 'Property management endpoints',
        },
        {
          name: 'Agents',
          description: 'Agent management endpoints',
        },
        {
          name: 'Inquiries',
          description: 'Inquiry management endpoints',
        },
        {
          name: 'Blog',
          description: 'Blog post management endpoints',
        },
        {
          name: 'User Profile',
          description: 'User profile management endpoints',
        },
        {
          name: 'Admin',
          description: 'Administrative endpoints (Admin role required)',
        },
      ],
    paths: {
      '/api/auth/signup': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          description: 'Create a new user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SignUpRequest' }
              }
            }
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' }
                }
              }
            },
            400: {
              description: 'Bad request - invalid data or user already exists'
            }
          }
        }
      },
      '/api/auth/session': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current session',
          description: 'Get information about the currently authenticated user',
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: 'Current user session',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      expires: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Not authenticated'
            }
          }
        }
      },
      '/api/properties': {
        get: {
          tags: ['Properties'],
          summary: 'Get all properties',
          description: 'Retrieve a list of all properties with optional filtering',
          parameters: [
            {
              in: 'query',
              name: 'featured',
              schema: { type: 'boolean' },
              description: 'Filter by featured properties'
            },
            {
              in: 'query',
              name: 'location',
              schema: { type: 'string' },
              description: 'Filter by location'
            }
          ],
          responses: {
            200: {
              description: 'List of properties',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Property' }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Properties'],
          summary: 'Create a new property',
          description: 'Add a new property listing (requires AGENT or ADMIN role)',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PropertyInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Property created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Property' }
                }
              }
            },
            401: {
              description: 'Unauthorized - authentication required'
            },
            403: {
              description: 'Forbidden - requires AGENT or ADMIN role'
            }
          }
        }
      },
      '/api/properties/{id}': {
        get: {
          tags: ['Properties'],
          summary: 'Get property by ID',
          description: 'Retrieve a single property by its ID',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Property ID'
            }
          ],
          responses: {
            200: {
              description: 'Property details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Property' }
                }
              }
            },
            404: {
              description: 'Property not found'
            }
          }
        },
        put: {
          tags: ['Properties'],
          summary: 'Update property',
          description: 'Update an existing property (requires property owner or ADMIN role)',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Property ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PropertyInput' }
              }
            }
          },
          responses: {
            200: {
              description: 'Property updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Property' }
                }
              }
            },
            401: {
              description: 'Unauthorized - authentication required'
            },
            403: {
              description: 'Forbidden - you can only update your own properties'
            },
            404: {
              description: 'Property not found'
            }
          }
        },
        delete: {
          tags: ['Properties'],
          summary: 'Delete property',
          description: 'Delete a property by ID (requires property owner or ADMIN role)',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Property ID'
            }
          ],
          responses: {
            204: {
              description: 'Property deleted successfully'
            },
            401: {
              description: 'Unauthorized - authentication required'
            },
            403: {
              description: 'Forbidden - you can only delete your own properties'
            },
            404: {
              description: 'Property not found'
            }
          }
        }
      },
      '/api/agents': {
        get: {
          tags: ['Agents'],
          summary: 'Get all agents',
          description: 'Retrieve a list of all agents with optional filtering',
          parameters: [
            {
              in: 'query',
              name: 'specialty',
              schema: { type: 'string' },
              description: 'Filter by agent specialty'
            },
            {
              in: 'query',
              name: 'language',
              schema: { type: 'string' },
              description: 'Filter by language spoken'
            }
          ],
          responses: {
            200: {
              description: 'List of agents',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Agent' }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Agents'],
          summary: 'Create a new agent',
          description: 'Add a new agent to the system',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AgentInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Agent created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Agent' }
                }
              }
            }
          }
        }
      },
      '/api/blog': {
        get: {
          tags: ['Blog'],
          summary: 'Get all blog posts',
          description: 'Retrieve a list of all blog posts with optional filtering',
          parameters: [
            {
              in: 'query',
              name: 'category',
              schema: { type: 'string' },
              description: 'Filter by category'
            },
            {
              in: 'query',
              name: 'tag',
              schema: { type: 'string' },
              description: 'Filter by tag'
            }
          ],
          responses: {
            200: {
              description: 'List of blog posts',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/BlogPost' }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Blog'],
          summary: 'Create a new blog post',
          description: 'Add a new blog post',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BlogPostInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Blog post created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/BlogPost' }
                }
              }
            }
          }
        }
      },
      '/api/user/profile': {
        put: {
          tags: ['User Profile'],
          summary: 'Update user profile',
          description: 'Update user profile information and password',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email'],
                  properties: {
                    name: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' },
                    currentPassword: { type: 'string', minLength: 6 },
                    newPassword: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Profile updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request - invalid data or password incorrect'
            },
            401: {
              description: 'Unauthorized - authentication required'
            }
          }
        }
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'Get all users (Admin only)',
          description: 'Retrieve all users with their basic information and property counts',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: 'List of all users',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      users: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string' },
                            role: { type: 'string', enum: ['USER', 'AGENT', 'ADMIN'] },
                            createdAt: { type: 'string', format: 'date-time' },
                            _count: {
                              type: 'object',
                              properties: {
                                properties: { type: 'integer' }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        }
      },
      '/api/admin/users/{id}': {
        put: {
          tags: ['Admin'],
          summary: 'Update user role (Admin only)',
          description: 'Update a user\'s role. Admins cannot change their own role.',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'User ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['role'],
                  properties: {
                    role: { type: 'string', enum: ['USER', 'AGENT', 'ADMIN'] }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'User role updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      user: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request - cannot change own role'
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete user (Admin only)',
          description: 'Delete a user account. Admins cannot delete their own account.',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'User ID'
            }
          ],
          responses: {
            200: {
              description: 'User deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad request - cannot delete own account'
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        }
      },
      '/api/admin/properties': {
        get: {
          tags: ['Admin'],
          summary: 'Get all properties (Admin only)',
          description: 'Retrieve all properties with owner information',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: 'List of all properties',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      properties: {
                        type: 'array',
                        items: {
                          allOf: [
                            { $ref: '#/components/schemas/Property' },
                            {
                              type: 'object',
                              properties: {
                                user: {
                                  type: 'object',
                                  properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' }
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        }
      },
      '/api/admin/properties/{id}': {
        put: {
          tags: ['Admin'],
          summary: 'Update property (Admin only)',
          description: 'Update property status (e.g., featured status)',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Property ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    featured: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Property updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      property: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          title: { type: 'string' },
                          featured: { type: 'boolean' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete property (Admin only)',
          description: 'Delete any property as administrator',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Property ID'
            }
          ],
          responses: {
            200: {
              description: 'Property deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        }
      },
      '/api/admin/agents': {
        get: {
          tags: ['Admin'],
          summary: 'Get all agents (Admin only)',
          description: 'Retrieve all agents with their statistics',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: 'List of all agents',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      agents: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Agent' }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        }
      },
      '/api/admin/agents/{id}': {
        delete: {
          tags: ['Admin'],
          summary: 'Delete agent (Admin only)',
          description: 'Delete an agent profile',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'integer' },
              description: 'Agent ID'
            }
          ],
          responses: {
            200: {
              description: 'Agent deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        }
      },
      '/api/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Get platform statistics (Admin only)',
          description: 'Retrieve comprehensive platform statistics and analytics',
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
          responses: {
            200: {
              description: 'Platform statistics',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      stats: {
                        type: 'object',
                        properties: {
                          totalUsers: { type: 'integer' },
                          totalProperties: { type: 'integer' },
                          totalAgents: { type: 'integer' },
                          totalInquiries: { type: 'integer' },
                          recentUserGrowth: { type: 'integer' },
                          recentPropertyGrowth: { type: 'integer' },
                          usersByRole: {
                            type: 'object',
                            properties: {
                              USER: { type: 'integer' },
                              AGENT: { type: 'integer' },
                              ADMIN: { type: 'integer' }
                            }
                          },
                          propertiesByStatus: {
                            type: 'object',
                            properties: {
                              featured: { type: 'integer' },
                              regular: { type: 'integer' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Admin access required'
            }
          }
        }
      }
    }
  }
}