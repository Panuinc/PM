import { NextResponse } from "next/server";
import {
  GetAllUserUseCase,
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
} from "@/app/api/setting/user/usecases/users.usecase";
import { formatUserData } from "@/app/api/setting/user/core/user.schema";
import logger from "@/lib/logger.node";

export async function getAllUser(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    const { users, total } = await GetAllUserUseCase(page, limit);
    return NextResponse.json({
      message: "Success",
      total,
      page,
      limit,
      users: formatUserData(users),
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function getUserById(request, userId) {
  try {
    const user = await GetUserByIdUseCase(userId);
    return NextResponse.json({
      message: "Success",
      user: formatUserData([user])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function createUser(request) {
  try {
    const data = await request.json();
    const user = await CreateUserUseCase(data);
    return NextResponse.json({
      message: "Created",
      user: formatUserData([user])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function updateUser(request, userId) {
  try {
    const data = await request.json();
    const user = await UpdateUserUseCase({ ...data, userId });
    return NextResponse.json({
      message: "Updated",
      user: formatUserData([user])[0],
    });
  } catch (error) {
    logger.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}
