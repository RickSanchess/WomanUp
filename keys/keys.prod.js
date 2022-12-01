/**
 * константы для окружения production
 */
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  TOKEN_EXP: process.env.TOKEN_EXP,

}
