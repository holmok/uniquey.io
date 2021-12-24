const Constants = require('@uniquey.io/common').Constants
module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${Constants.apiUrl}/:path*`
            },
        ]
    },

}