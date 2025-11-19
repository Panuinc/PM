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
        const { email, password } = credentials ?? {};

        if (!email || !password) {
          throw new Error(
            JSON.stringify({
              message: "Email and password required",
              type: "warning",
            })
          );
        }

        const user = await prisma.user.findUnique({
          where: { userEmail: email },
          include: {
            userPermissions: {
              include: { permission: true },
            },
          },
        });

        if (!user) {
          throw new Error(
            JSON.stringify({
              message: "Email not found",
              type: "danger",
            })
          );
        }

        if (user.userStatus !== "Enable") {
          throw new Error(
            JSON.stringify({
              message: "Account disabled",
              type: "danger",
            })
          );
        }

        const match = await bcrypt.compare(password, user.userPassword);

        if (!match) {
          throw new Error(
            JSON.stringify({
              message: "Incorrect password",
              type: "danger",
            })
          );
        }

        const permissions = user.userPermissions
          .filter((x) => x.userPermissionStatus === "Enable")
          .map((x) => x.permission.permissionName);

        return {
          userId: user.userId,
          userFirstName: user.userFirstName,
          userLastName: user.userLastName,
          userEmail: user.userEmail,
          userStatus: user.userStatus,
          userCreatedBy: user.userCreatedBy,
          userCreatedAt: user.userCreatedAt,
          userUpdatedBy: user.userUpdatedBy,
          userUpdatedAt: user.userUpdatedAt,

          permissions,

          userPermissions: user.userPermissions,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);
      const timeout = 60 * 60;

      if (user) {
        token.user = {
          ...user,
          permissions: user.permissions,
          userPermissions: user.userPermissions,
        };
        token.exp = now + timeout;
      } else if (token?.exp && now > token.exp - 300) {
        token.exp = now + timeout;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user; 
        session.expires = new Date(token.exp * 1000).toISOString();
      }
      return session;
    },
  },
};
