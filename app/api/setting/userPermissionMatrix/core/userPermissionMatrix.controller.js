"use server";

import { NextResponse } from "next/server";
import {
  GetAllUserPermissionMatrixUseCase,
  UpdateUserPermissionMatrixUseCase,
} from "@/app/api/setting/userPermissionMatrix/usecases/userPermissionMatrix.usecase";
import logger from "@/lib/logger.node";

export async function getAllUserPermissionMatrix(request) {
  try {
    const data = await GetAllUserPermissionMatrixUseCase();
    return NextResponse.json({ message: "Success", data });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function updateUserPermissionMatrix(request) {
  try {
    const body = await request.json();
    await UpdateUserPermissionMatrixUseCase(body);
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
