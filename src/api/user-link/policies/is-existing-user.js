"use strict";

/**
 * `is-your-comment` policy.
 */

const { ApplicationError } = require("@strapi/utils").errors;

module.exports = async (policyContext, config, { strapi }) => {
  const { user_id, vieweduser_id } = policyContext.params;
  const data = policyContext.request.body.data;
  const entry_user = await strapi.db
    .query("plugin::users-permissions.user")
    .findOne({ where: { id: Number(user_id) } });
  if (!entry_user) {
    throw new ApplicationError("User ID cannot be found.", { user_id });
  }
  if (data) {
    const entry_receiver = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id: data.receiver } });
    if (!entry_receiver) {
      throw new ApplicationError("Receiver ID cannot be found.", {
        vieweduser_id,
      });
    }
  }
  if (vieweduser_id) {
    const entry_vieweduser = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { id: Number(vieweduser_id) } });
    if (!entry_vieweduser) {
      throw new ApplicationError("Viewed User ID cannot be found.", {
        vieweduser_id,
      });
    }
  }
  return true;
};
