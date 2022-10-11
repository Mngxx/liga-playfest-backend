module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "myToken"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "myToken"),
  },
});
