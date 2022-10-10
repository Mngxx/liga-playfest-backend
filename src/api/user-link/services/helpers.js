"user strict";

module.exports = ({ strapi }) => ({
  async get_friends(user_id) {
    const existing_entries = await strapi.entityService.findMany(
      "api::user-link.user-link",
      {
        fields: ["id", "status"],
        filters: {
          $or: [
            {
              sender: { id: `${user_id}` },
              status: "friends",
            },
            {
              receiver: { id: `${user_id}` },
              status: "friends",
            },
          ],
        },
        populate: {
          sender: {
            fields: ["id", "username", "activityStatus"],
            populate: {
              avatar: {
                fields: "url",
              },
            },
          },
          receiver: {
            fields: ["id", "username", "activityStatus"],
            populate: {
              avatar: {
                fields: "url",
              },
            },
          },
        },
      }
    );
    const list = existing_entries.map((f) => {
      let friend_link = {
        id: f.id,
        status: f.status,
        user: {
          id: f.sender.id,
          activityStatus: f.sender.activityStatus,
          username: f.sender.username,
          avatar: f.sender.avatar,
        },
      };
      if (f.sender.id === Number(user_id)) {
        friend_link.user.id = f.receiver.id;
        friend_link.user.activityStatus = f.receiver.activityStatus;
        friend_link.user.username = f.receiver.username;
        friend_link.user.avatar = f.receiver.avatar;
        return friend_link;
      } else {
        return friend_link;
      }
    });
    return list;
  },
});
