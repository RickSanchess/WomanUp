/**
 * Выбор констант в зависимости от окружения развертывания
 */

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}