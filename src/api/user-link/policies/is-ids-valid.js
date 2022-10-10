"use strict";

/**
 * `is-your-comment` policy.
 */

const { ApplicationError } = require("@strapi/utils").errors;

module.exports = async (policyContext, config, { strapi }) => {
  const { user_id, link_id, vieweduser_id } = policyContext.params;
  if (
    user_id
      ? isNaN(user_id)
      : false || link_id
      ? isNaN(link_id)
      : false || vieweduser_id
      ? isNaN(vieweduser_id)
      : false
  ) {
    throw new ApplicationError(
      "IDs must be a valid number. Please check your parameters.",
      { user_id }
    );
  } else {
    return true;
  }
};
