import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 5 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials || {};

        const fail = (msg, type = "danger") => {
          throw new Error(JSON.stringify({ message: msg, type }));
        };

        if (!email || !password) {
          return fail("Please enter both email and password.", "warning");
        }

        const user = await prisma.user.findUnique({
          where: { userEmail: email },
          include: {
            department: true,
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user) return fail("Email not found.", "danger");
        if (user.userStatus !== "Enable")
          return fail("Your account has been disabled.", "danger");

        const ok = await bcrypt.compare(password, user.userPassword);
        if (!ok) return fail("Incorrect password.", "danger");

        return {
          id: user.userId,
          userFirstName: user.userFirstName,
          userLastName: user.userLastName,
          email: user.userEmail,
          status: user.userStatus,
          department: {
            id: user.department.departmentId,
            name: user.department.departmentName,
            status: user.department.departmentStatus,
          },
          roles: user.userRoles.map((ur) => ({
            id: ur.role.roleId,
            name: ur.role.roleName,
            status: ur.role.roleStatus,
            permissions: ur.role.rolePermissions.map((rp) => ({
              id: rp.permission.permissionId,
              name: rp.permission.permissionName,
              key: rp.permission.permissionKey,
              status: rp.permission.permissionStatus,
            })),
          })),
          toast: {
            type: "success",
            message: "Login successful!",
          },
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const TIMEOUT = 60 * 60;
      const current = Math.floor(Date.now() / 1000);

      if (user) {
        token.user = user;
        token.exp = current + TIMEOUT;
        if (user.toast) {
          token.toast = user.toast;
          token.toastShown = false;
        }
      } else if (token?.user) {
        if (current > token.exp - 300) {
          token.exp = current + TIMEOUT;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
        session.expires = new Date(token.exp * 1000).toISOString();
      }

      if (token?.toast && !token.toastShown) {
        session.toast = token.toast;
        token.toastShown = true;
      }

      return session;
    },
  },
};
