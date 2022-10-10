"use strict";

/**
 * `is-associated-user-receiver` policy.
 */

const { ApplicationError } = require("@strapi/utils").errors;

module.exports = async (policyContext, config, { strapi }) => {
  const { user_id } = policyContext.params;
  const data = policyContext.request.body.data;
  const existing_entries = await strapi.entityService.findMany(
    "api::user-link.user-link",
    {
      filters: {
        $or: [
          {
            sender: { id: `${user_id}` },
            receiver: { id: `${data.receiver}` },
          },
          {
            sender: { id: `${data.receiver}` },
            receiver: { id: `${user_id}` },
          },
        ],
      },
    }
  );
  if (existing_entries.length > 0) {
    throw new ApplicationError("User is already associated.", {
      existing_entries,
    });
  } else {
    return true;
  }
};
