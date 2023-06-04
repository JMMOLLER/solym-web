const allowedOrigins = [
    "*",
    // "https://solym.vercel.app",
    // "https://solym-web.vercel.app",
    // "https://solym-jmmoller.vercel.app",
    // "https://solym-git-main-jmmoller.vercel.app",
];

module.exports = {
    config: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}