import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding RBAC system...");

  const password = await bcrypt.hash("12345", 10);

  // STEP 1 — Create without userCreatedBy (NULL)
  let superAdmin = await prisma.user.upsert({
    where: { userEmail: "super@admin.com" },
    update: {},
    create: {
      userFirstName: "Super",
      userLastName: "Admin",
      userEmail: "super@admin.com",
      userPassword: password,
      userStatus: "Enable",
      userCreatedBy: null, // FIX: cannot reference itself yet
    },
  });

  // STEP 2 — Update to set userCreatedBy = own ID
  superAdmin = await prisma.user.update({
    where: { userId: superAdmin.userId },
    data: { userCreatedBy: superAdmin.userId },
  });

  // Create Role
  const role = await prisma.role.upsert({
    where: { roleName: "SuperAdmin" },
    update: {},
    create: {
      roleName: "SuperAdmin",
      roleCreatedBy: superAdmin.userId,
    },
  });

  // Link User ↔ Role
  await prisma.userRole.upsert({
    where: {
      userRoleUserId_userRoleRoleId: {
        userRoleUserId: superAdmin.userId,
        userRoleRoleId: role.roleId,
      },
    },
    update: {},
    create: {
      userRoleUserId: superAdmin.userId,
      userRoleRoleId: role.roleId,
      userRoleCreatedBy: superAdmin.userId,
    },
  });

  const permissionKeys = [
    "menu.dashboard",
    "menu.setting",
    "menu.user",
    "menu.role",
    "menu.permission",
    "menu.rolePermission",
    "menu.userRole",

    "user.read",
    "user.create",
    "user.update",

    "role.read",
    "role.create",
    "role.update",

    "permission.read",
    "permission.create",
    "permission.update",

    "rolePermission.read",
    "rolePermission.create",
    "rolePermission.update",

    "userRole.read",
    "userRole.create",
    "userRole.update",
  ];

  for (const key of permissionKeys) {
    const permission = await prisma.permission.upsert({
      where: { permissionKey: key },
      update: {},
      create: {
        permissionName: key,
        permissionKey: key,
        permissionCreatedBy: superAdmin.userId,
      },
    });

    await prisma.rolePermission.upsert({
      where: {
        rolePermissionRoleId_rolePermissionPermissionId: {
          rolePermissionRoleId: role.roleId,
          rolePermissionPermissionId: permission.permissionId,
        },
      },
      update: {},
      create: {
        rolePermissionRoleId: role.roleId,
        rolePermissionPermissionId: permission.permissionId,
        rolePermissionCreatedBy: superAdmin.userId,
      },
    });
  }

  console.log("🌱 RBAC seed completed.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
