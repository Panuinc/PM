"use server";

import { NextResponse } from "next/server";
import {
  GetAllUserPermissionMatrixUseCase,
  UpdateUserPermissionMatrixUseCase,
} from "@/app/api/setting/userPermissionMatrix/usecases/userPermissionMatrix.usecase";
import logger from "@/lib/logger.node";

export async function getAllUserPermissionMatrix(request) {
  try {
    logger.info({
      message: "Controller.getAllUserPermissionMatrix request",
      url: request.url,
    });

    const data = await GetAllUserPermissionMatrixUseCase();
    logger.info({
      message: "Controller.getAllUserPermissionMatrix success",
      permissions: data.permissions.length,
      users: data.matrix.length,
    });

    return NextResponse.json({ message: "Success", data });
  } catch (error) {
    logger.error({
      message: "Controller.getAllUserPermissionMatrix error",
      error: error.message,
    });
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function updateUserPermissionMatrix(request) {
  try {
    const body = await request.json();
    logger.info({
      message: "Controller.updateUserPermissionMatrix received",
      matrixUsers: body.matrix?.length || 0,
    });

    await UpdateUserPermissionMatrixUseCase(body);

    logger.info({ message: "Controller.updateUserPermissionMatrix success" });
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    logger.error({
      message: "Controller.updateUserPermissionMatrix error",
      error: error.message,
    });
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}
