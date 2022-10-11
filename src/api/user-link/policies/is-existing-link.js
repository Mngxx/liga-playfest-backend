"use strict";

/**
 * `is-your-comment` policy.
 */

const { ApplicationError } = require("@strapi/utils").errors;

module.exports = async (policyContext, config, { strapi }) => {
  const { user_id, link_id } = policyContext.params;

  const entry = await strapi.entityService.findOne(
    "api::user-link.user-link",
    Number(link_id),
    {
      fields: ["id"],
      populate: {
        sender: {
          fields: ["id"],
        },
        receiver: {
          fields: ["id"],
        },
      },
    }
  );
  if (!entry) {
    throw new ApplicationError(
      "User Link does not exist. Please check your parameters.",
      { link_id }
    );
  }
  if (
    entry.sender.id !== Number(user_id) &&
    entry.receiver.id !== Number(user_id)
  ) {
    throw new ApplicationError(
      "User ID must be associated with the User Link.",
      {
        user_id,
        entry,
      }
    );
  }
  return true;
};
