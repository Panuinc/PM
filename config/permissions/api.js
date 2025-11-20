export const apiActionRules = {
  "/api/setting/user": {
    GET: "user.read",
    POST: "user.create",
    PUT: "user.update",
  },

  "/api/setting/permission": {
    GET: "permission.read",
    POST: "permission.create",
    PUT: "permission.update",
  },

  "/api/setting/userPermission": {
    GET: "userPermission.read",
    POST: "userPermission.create",
    PUT: "userPermission.update",
  },
};
