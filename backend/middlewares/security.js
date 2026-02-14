const parseAllowedOrigins = () => {
    const raw = process.env.CORS_ORIGINS || '';
    return raw
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};

export const corsOptions = {
    origin: (origin, callback) => {
        const allowList = parseAllowedOrigins();

        // Allow non-browser requests and local tooling with no Origin header.
        if (!origin) {
            return callback(null, true);
        }

        // If no allow-list is configured, keep behavior open for now.
        if (allowList.length === 0) {
            return callback(null, true);
        }

        if (allowList.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    }
};

export const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
};

export const createRateLimiter = ({ windowMs, max, message }) => {
    const buckets = new Map();

    return (req, res, next) => {
        const key = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const entry = buckets.get(key) || { count: 0, resetAt: now + windowMs };

        if (now > entry.resetAt) {
            entry.count = 0;
            entry.resetAt = now + windowMs;
        }

        entry.count += 1;
        buckets.set(key, entry);

        if (entry.count > max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            res.setHeader('Retry-After', String(retryAfter));
            return res.status(429).json({
                success: false,
                message
            });
        }

        return next();
    };
};

export const writeLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 60,
    message: 'Too many write requests. Please try again shortly.'
});

export const orderLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many order requests. Please try again shortly.'
});

export const reviewLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Too many review requests. Please try again shortly.'
});
