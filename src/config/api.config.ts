/**
 * =============================================================================
 * API CONFIGURATION
 * =============================================================================
 * Single source of truth for every backend endpoint this storefront will call
 * once the ASP.NET Core Web API is available.
 *
 * Nothing in this file performs a network request. It only *describes* the
 * contract (method, route, request payload, response shape) that the mock
 * services in `src/services/*` are standing in for. When the real API is
 * ready, the services should be updated to call `fetch`/`axios` against
 * `BASE_URL + API.<resource>.<action>.endpoint` using the documented
 * payload/response types below — the rest of the app (components, pages,
 * contexts) should not need to change.
 * =============================================================================
 */

/** Base URL of the ASP.NET Core Web API. Overridable via .env (VITE_API_BASE_URL). */
export const BASE_URL: string =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_BASE_URL ??
  'https://localhost:5001'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface EndpointDefinition<TRequest = never, TResponse = unknown> {
  method: HttpMethod
  /** Route relative to BASE_URL. `{param}` segments are path parameters. */
  endpoint: string
  description: string
  /** Present only to document the expected request payload shape at compile time. */
  __request?: TRequest
  /** Present only to document the expected response shape at compile time. */
  __response?: TResponse
}

/* ------------------------------------------------------------------------- */
/* Shared domain models (mirror the future ASP.NET Core DTOs)                */
/* ------------------------------------------------------------------------- */

export interface ProductDto {
  id: number
  slug: string
  name: string
  brand: string
  categorySlug: string
  price: number
  compareAtPrice?: number
  currency: string
  images: string[]
  imageBg: string
  colors: { name: string; hex: string }[]
  sizes: string[]
  rating: number
  reviewCount: number
  description: string
  features: string[]
  tags: string[]
  isNew?: boolean
  inStock: boolean
}

export interface CategoryDto {
  id: number
  slug: string
  name: string
  description: string
  image: string
}

export interface CartItemDto {
  productId: number
  quantity: number
  size: string
  color: string
}

export interface AddressDto {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface OrderDto {
  id: string
  createdAt: string
  status: 'processing' | 'shipped' | 'delivered'
  items: Array<{
    productId: number
    name: string
    image: string
    imageBg: string
    price: number
    quantity: number
    size: string
    color: string
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: AddressDto
  paymentMethod: string
}

export interface UserDto {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface AuthResponseDto {
  token: string
  user: UserDto
}

/* ------------------------------------------------------------------------- */
/* Endpoint catalogue                                                        */
/* ------------------------------------------------------------------------- */

export const API = {
  products: {
    /** List all products. Supports optional filtering/sorting/pagination via query string. */
    getAll: {
      method: 'GET',
      endpoint: '/api/products',
      description:
        'Returns the full product catalog. Query params: category, minPrice, maxPrice, sort, q, page, pageSize.',
    } as EndpointDefinition<never, ProductDto[]>,

    /** Fetch a single product by its slug. */
    getBySlug: {
      method: 'GET',
      endpoint: '/api/products/{slug}',
      description: 'Returns one product by slug, including full detail fields.',
    } as EndpointDefinition<never, ProductDto>,

    /** Full-text search across name, brand, and tags. */
    search: {
      method: 'GET',
      endpoint: '/api/products/search',
      description: 'Query param: q (search term). Returns matching products ranked by relevance.',
    } as EndpointDefinition<never, ProductDto[]>,

    /** Products related to a given product (same category, excluding itself). */
    getRelated: {
      method: 'GET',
      endpoint: '/api/products/{slug}/related',
      description: 'Returns up to 4 related products for the product detail page.',
    } as EndpointDefinition<never, ProductDto[]>,
  },

  categories: {
    getAll: {
      method: 'GET',
      endpoint: '/api/categories',
      description: 'Returns all product categories for navigation and the Categories page.',
    } as EndpointDefinition<never, CategoryDto[]>,

    getBySlug: {
      method: 'GET',
      endpoint: '/api/categories/{slug}',
      description: 'Returns a single category by slug.',
    } as EndpointDefinition<never, CategoryDto>,
  },

  cart: {
    /** Get the current user/session cart. */
    get: {
      method: 'GET',
      endpoint: '/api/cart',
      description: 'Returns the authenticated user (or session) cart contents.',
    } as EndpointDefinition<never, CartItemDto[]>,

    addItem: {
      method: 'POST',
      endpoint: '/api/cart/add',
      description: 'Adds a product/size/color combination to the cart, or increments its quantity.',
    } as EndpointDefinition<CartItemDto, CartItemDto[]>,

    updateItem: {
      method: 'PUT',
      endpoint: '/api/cart/update',
      description: 'Updates the quantity for an existing cart line (identified by productId + size + color).',
    } as EndpointDefinition<CartItemDto, CartItemDto[]>,

    removeItem: {
      method: 'DELETE',
      endpoint: '/api/cart/remove',
      description: 'Removes a single line item from the cart.',
    } as EndpointDefinition<{ productId: number; size: string; color: string }, CartItemDto[]>,

    clear: {
      method: 'DELETE',
      endpoint: '/api/cart/clear',
      description: 'Empties the entire cart. Called after a successful checkout.',
    } as EndpointDefinition<never, void>,
  },

  wishlist: {
    get: {
      method: 'GET',
      endpoint: '/api/wishlist',
      description: 'Returns the authenticated user’s saved/wishlisted product IDs.',
    } as EndpointDefinition<never, number[]>,

    addItem: {
      method: 'POST',
      endpoint: '/api/wishlist/add',
      description: 'Adds a product to the wishlist.',
    } as EndpointDefinition<{ productId: number }, number[]>,

    removeItem: {
      method: 'DELETE',
      endpoint: '/api/wishlist/remove',
      description: 'Removes a product from the wishlist.',
    } as EndpointDefinition<{ productId: number }, number[]>,
  },

  orders: {
    /** Places an order from the current cart contents. */
    create: {
      method: 'POST',
      endpoint: '/api/orders',
      description: 'Creates a new order from the submitted cart + shipping + payment details and returns the confirmed order.',
    } as EndpointDefinition<
      { items: CartItemDto[]; shippingAddress: AddressDto; paymentMethod: string },
      OrderDto
    >,

    getAll: {
      method: 'GET',
      endpoint: '/api/orders',
      description: 'Returns the authenticated user’s order history, most recent first.',
    } as EndpointDefinition<never, OrderDto[]>,

    getById: {
      method: 'GET',
      endpoint: '/api/orders/{id}',
      description: 'Returns a single order by its ID, for the order confirmation / order detail views.',
    } as EndpointDefinition<never, OrderDto>,
  },

  auth: {
    login: {
      method: 'POST',
      endpoint: '/api/auth/login',
      description: 'Authenticates a user by email/password and returns a session token + user profile.',
    } as EndpointDefinition<{ email: string; password: string }, AuthResponseDto>,

    register: {
      method: 'POST',
      endpoint: '/api/auth/register',
      description: 'Creates a new user account and returns a session token + user profile.',
    } as EndpointDefinition<
      { firstName: string; lastName: string; email: string; password: string },
      AuthResponseDto
    >,

    logout: {
      method: 'POST',
      endpoint: '/api/auth/logout',
      description: 'Invalidates the current session token.',
    } as EndpointDefinition<never, void>,

    me: {
      method: 'GET',
      endpoint: '/api/auth/me',
      description: 'Returns the currently authenticated user’s profile.',
    } as EndpointDefinition<never, UserDto>,
  },

  account: {
    updateProfile: {
      method: 'PUT',
      endpoint: '/api/account/profile',
      description: 'Updates the authenticated user’s profile fields (name, email).',
    } as EndpointDefinition<Partial<Pick<UserDto, 'firstName' | 'lastName' | 'email'>>, UserDto>,

    getAddresses: {
      method: 'GET',
      endpoint: '/api/account/addresses',
      description: 'Returns the saved shipping addresses for the authenticated user.',
    } as EndpointDefinition<never, AddressDto[]>,

    saveAddress: {
      method: 'POST',
      endpoint: '/api/account/addresses',
      description: 'Saves a new shipping address to the authenticated user’s account.',
    } as EndpointDefinition<AddressDto, AddressDto[]>,
  },

  contact: {
    sendMessage: {
      method: 'POST',
      endpoint: '/api/contact',
      description: 'Submits the Contact Us form to the support inbox.',
    } as EndpointDefinition<
      { name: string; email: string; subject: string; message: string },
      { success: boolean }
    >,
  },

  newsletter: {
    subscribe: {
      method: 'POST',
      endpoint: '/api/newsletter/subscribe',
      description: 'Subscribes an email address to the marketing newsletter.',
    } as EndpointDefinition<{ email: string }, { success: boolean }>,
  },
} as const
