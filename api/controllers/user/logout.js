module.exports = {
  friendlyName: "Logout",

  description: "Log out of this app.",

  extendedDescription: `This action deletes the \`req.session.userId\` key from the session of
  the requesting user agent Note that this action does not check to see whether or not the requesting
  user was actually logged in.  (If they weren't, then this action is just a no-op.)`,

  exits: {
    success: {
      description:
        "The requesting user agent has been successfully logged out.",
    },
    redirect: {
      description: "The requesting user agent looks to be a web browser.",
      extendedDescription:
        "After logging out from a web browser, the user is redirected away.",
      responseType: "redirect",
    },
  },

  fn: async function () {
    sails.log(this.req.session);

    // Clear the `userId` property from this session.
    delete this.req.session.userId;

    // Broadcast a message that we can display in other open tabs.
    if (sails.hooks.sockets) {
      await sails.helpers.broadcastSessionChange(this.req);
    }

    if (!this.req.wantsJSON) {
      throw { redirect: "/login" };
    }
  },
};
