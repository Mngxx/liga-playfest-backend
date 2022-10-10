module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-links/:user_id/mutualfriends/:vieweduser_id",
      handler: "user-link.get_userlinks_mutualfriends",
      config: {
        policies: ["is-ids-valid", "is-existing-user"],
      },
    },
    {
      method: "GET",
      path: "/user-links/:user_id/:status/:role",
      handler: "user-link.get_userlinks_status",
      config: {
        policies: ["is-ids-valid", "is-existing-user"],
      },
    },
    {
      method: "GET",
      path: "/user-links/:user_id/friends",
      handler: "user-link.get_userlinks_friends",

    },
    {
      method: "POST",
      path: "/user-links/:user_id",
      handler: "user-link.create_userlinks",
      config: {
        policies: [
          "is-ids-valid",
          "is-existing-user",
          "is-associated-user-receiver",
        ],
      },
    },
    {
      method: "PUT",
      path: "/user-links/:user_id/:link_id",
      handler: "user-link.update_userlinks",
      config: {
        policies: ["is-ids-valid", "is-existing-user", "is-existing-link"],
      },
    },
    {
      method: "DELETE",
      path: "/user-links/:user_id/:link_id",
      handler: "user-link.remove_userlinks",
      config: {
        policies: ["is-ids-valid", "is-existing-user", "is-existing-link"],
      },
    },
  ],
};
