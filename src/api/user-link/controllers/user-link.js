"use strict";

/**
 * user-link controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::user-link.user-link",
  ({ strapi }) => ({
    async create_userlinks(ctx) {
      const { user_id } = ctx.params;
      const data = ctx.request.body.data;
      if (Number(user_id) === data.receiver) {
        return ctx.badRequest("User cannot be linked with itself.");
      }
      if (data.status !== "pending") {
        return ctx.badRequest("Users can only have pending status as a start.");
      }
      const user_link = {
        data: {
          ...data,
          sender: Number(user_id),
        },
      };

      const response = await strapi.entityService.create(
        "api::user-link.user-link",
        user_link
      );
      console.log("adfafdafad");
      return response;
    },
    async update_userlinks(ctx) {
      const { user_id, link_id } = ctx.params;
      const data = ctx.request.body.data;
      if (data.status === "pending") {
        return ctx.badRequest(
          "Users can only update existing link status to blocked or friends."
        );
      }
      const response = await strapi.entityService.update(
        "api::user-link.user-link",
        Number(link_id),
        {
          data: {
            status: data.status,
          },
        }
      );
      return response;
    },
    async remove_userlinks(ctx) {
      const { user_id, link_id } = ctx.params;
      const response = await strapi.entityService.delete(
        "api::user-link.user-link",
        Number(link_id)
      );
      return response;
    },
    async get_userlinks_status(ctx) {
      const { user_id, status, role } = ctx.params;

      if (status !== "pending" && status !== "blocked") {
        return ctx.badRequest(
          "User links with certain roles can only be pending or blocked as status. Please check your parameters"
        );
      }
      if (role !== "sender" && role !== "receiver") {
        return ctx.badRequest(
          "User links can only be have sender and receiver as roles. Please check your parameters"
        );
      }
      const opp_role = role === "sender" ? "receiver" : "sender";
      const existing_entries = await strapi.entityService.findMany(
        "api::user-link.user-link",
        {
          fields: ["id", "status"],
          filters: {
            [role]: { id: `${user_id}` },
            status: status,
          },
          populate: {
            [opp_role]: {
              fields: ["id", "username", "activityStatus"],
            },
          },
        }
      );
      return existing_entries;
    },
    async get_userlinks_friends(ctx) {
      const { user_id } = ctx.params;
      const list = await strapi
        .service("api::user-link.helpers")
        .get_friends(user_id);
      return list;
    },
    async get_userlinks_mutualfriends(ctx) {
      const { user_id, vieweduser_id } = ctx.params;
      const user_list = await strapi
        .service("api::user-link.helpers")
        .get_friends(user_id);
      const vieweduser_list = await strapi
        .service("api::user-link.helpers")
        .get_friends(vieweduser_id);
      console.log(user_list);
      console.log(vieweduser_list);
      const user_list_id = user_list.map((u) => {
        return u.user.id;
      });
      const mutual_list = vieweduser_list
        .filter((u) => {
          if (user_list_id.includes(u.user.id)) {
            return true;
          } else {
            return false;
          }
        })
        .map((u) => {
          return u.user;
        });
      return mutual_list;
    },
  })
);
