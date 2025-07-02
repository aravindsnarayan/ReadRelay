import { z } from 'zod';
// Base validation schemas
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const phoneSchema = z
    .string()
    .regex(/^\+?[\d\s\-()]+$/)
    .optional();
// User and Profile validation
export const usernameSchema = z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');
export const profileSchema = z.object({
    username: usernameSchema,
    full_name: z.string().min(1, 'Full name is required').max(100),
    bio: z.string().max(500).optional(),
    avatar_url: z.string().url().optional(),
    location_text: z.string().max(200).optional(),
    location_latitude: z.number().min(-90).max(90).optional(),
    location_longitude: z.number().min(-180).max(180).optional(),
    preferred_meeting_locations: z.array(z.string()).optional(),
    phone: phoneSchema,
    notification_preferences: z
        .object({
        email: z.boolean().default(true),
        push: z.boolean().default(true),
        sms: z.boolean().default(false),
    })
        .optional(),
    privacy_settings: z
        .object({
        location_visible: z.boolean().default(true),
        phone_visible: z.boolean().default(false),
    })
        .optional(),
});
export const profileUpdateSchema = profileSchema.partial().extend({
    avatar_url: z.string().url().optional(),
});
// Book validation
export const bookConditionSchema = z.enum([
    'excellent',
    'good',
    'fair',
    'poor',
]);
export const exchangeTypeSchema = z.enum(['borrow', 'swap', 'give_away']);
export const availabilityStatusSchema = z.enum([
    'available',
    'exchanging',
    'unavailable',
]);
export const bookSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    author: z.string().min(1, 'Author is required').max(255),
    isbn: z.string().optional(),
    description: z.string().max(2000).optional(),
    publisher: z.string().max(200).optional(),
    publication_year: z
        .number()
        .int()
        .min(1000)
        .max(new Date().getFullYear())
        .optional(),
    language: z.string().min(2).max(10).default('en'),
    genre: z.string().max(100).optional(),
    condition: bookConditionSchema,
    exchange_type: exchangeTypeSchema,
    cover_image_url: z.string().url().optional(),
    max_borrow_days: z.number().int().min(1).max(365).optional(),
    tags: z.array(z.string().max(50)).optional(),
    external_id: z.string().max(100).optional(),
    external_source: z.string().max(50).optional(),
});
export const bookUpdateSchema = bookSchema.partial().extend({
    cover_image_url: z.string().url().optional(),
});
// Exchange validation
export const exchangeStatusSchema = z.enum([
    'pending',
    'accepted',
    'rejected',
    'in_progress',
    'completed',
    'cancelled',
]);
export const exchangeSchema = z.object({
    book_id: uuidSchema,
    exchange_type: exchangeTypeSchema,
    return_date: z.string().datetime().optional(),
    meeting_location: z.string().max(500).optional(),
    meeting_datetime: z.string().datetime().optional(),
    notes: z.string().max(1000).optional(),
});
export const exchangeUpdateSchema = exchangeSchema.partial().extend({
    status: z
        .enum([
        'pending',
        'accepted',
        'rejected',
        'in_progress',
        'completed',
        'cancelled',
    ])
        .optional(),
});
// Message validation
export const messageTypeSchema = z.enum([
    'text',
    'template',
    'system',
    'location',
]);
export const messageSchema = z.object({
    exchange_id: uuidSchema,
    receiver_id: uuidSchema,
    content: z.string().min(1, 'Message content is required').max(2000),
    message_type: messageTypeSchema.default('text'),
    template_data: z.record(z.any()).optional(),
});
// Review validation
export const reviewTypeSchema = z.enum(['owner', 'requester']);
export const reviewSchema = z.object({
    exchange_id: uuidSchema,
    reviewee_id: uuidSchema,
    rating: z.number().int().min(1).max(5),
    review_text: z.string().max(1000).optional(),
    review_type: reviewTypeSchema,
    is_public: z.boolean().default(true),
});
// Wishlist validation
export const wishlistPrioritySchema = z.enum(['low', 'medium', 'high']);
export const wishlistSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    author: z.string().max(255).optional(),
    isbn: z.string().optional(),
    description: z.string().max(1000).optional(),
    priority: wishlistPrioritySchema.default('medium'),
    notification_enabled: z.boolean().default(true),
});
// Location validation
export const locationSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});
export const radiusSearchSchema = z.object({
    center: locationSchema,
    radius_km: z.number().min(0.1).max(100).default(10),
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
});
// Search and filter validation
export const bookSearchSchema = z
    .object({
    query: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional().nullable(),
    condition: bookConditionSchema.optional(),
    exchange_type: exchangeTypeSchema.optional(),
    availability_status: availabilityStatusSchema.optional(),
    owner_id: uuidSchema.optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
})
    .transform(data => ({
    ...data,
    genre: data.genre || undefined, // Convert null to undefined
}));
// Authentication validation
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export const registerSchema = z.object({
    email: emailSchema,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: usernameSchema,
    full_name: z.string().min(1, 'Full name is required').max(100),
});
export const resetPasswordSchema = z.object({
    email: emailSchema,
});
export const updatePasswordSchema = z.object({
    current_password: z.string().min(6),
    new_password: z.string().min(6, 'New password must be at least 6 characters'),
});
// Validation helper functions
export const validateInput = (schema, data) => {
    return schema.parse(data);
};
export const safeValidateInput = (schema, data) => {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
};
