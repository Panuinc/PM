import { VisitorService } from "@/app/api/security/visitor/core/visitor.service";
import {
  visitorPostSchema,
  visitorPutSchema,
} from "@/app/api/security/visitor/core/visitor.schema";
import { VisitorValidator } from "@/app/api/security/visitor/core/visitor.validator";
import { getLocalNow } from "@/lib/getLocalNow";
import logger from "@/lib/logger.node";

export async function GetAllVisitorUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const visitors = await VisitorService.getAllPaginated(skip, limit);
  const total = await VisitorService.countAll();

  return { visitors, total };
}

export async function GetVisitorByIdUseCase(visitorId) {
  if (!visitorId || typeof visitorId !== "string") {
    throw { status: 400, message: "Invalid visitor ID" };
  }

  const visitor = await VisitorService.getById(visitorId);
  if (!visitor) {
    throw { status: 404, message: "Visitor not found" };
  }

  return visitor;
}

export async function CreateVisitorUseCase(data) {
  logger.info({
    message: "CreateVisitorUseCase start",
    visitorName: data?.visitorName,
    visitorCreatedBy: data?.visitorCreatedBy,
  });

  const parsed = visitorPostSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "CreateVisitorUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const normalizedVisitorName = parsed.data.visitorName.trim().toLowerCase();

  const duplicate = await VisitorValidator.isDuplicateVisitorName(normalizedVisitorName);
  if (duplicate) {
    logger.warn({
      message: "CreateVisitorUseCase duplicate visitorName",
      visitorName: normalizedVisitorName,
    });

    throw {
      status: 409,
      message: `visitorName '${normalizedVisitorName}' already exists`,
    };
  }

  try {
    const visitor = await VisitorService.create({
      ...parsed.data,
      visitorName: normalizedVisitorName,
      visitorCreatedAt: getLocalNow(),
    });

    logger.info({
      message: "CreateVisitorUseCase success",
      visitorId: visitor.visitorId,
    });

    return visitor;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "CreateVisitorUseCase unique constraint violation on visitorName (P2002)",
        visitorName: normalizedVisitorName,
      });

      throw {
        status: 409,
        message: `visitorName '${normalizedVisitorName}' already exists`,
      };
    }

    logger.error({
      message: "CreateVisitorUseCase error",
      error,
    });

    throw error;
  }
}

export async function UpdateVisitorUseCase(data) {
  logger.info({
    message: "UpdateVisitorUseCase start",
    visitorId: data?.visitorId,
    visitorName: data?.visitorName,
    visitorUpdatedBy: data?.visitorUpdatedBy,
  });

  const parsed = visitorPutSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    logger.warn({
      message: "UpdateVisitorUseCase validation failed",
      errors: fieldErrors,
    });

    throw {
      status: 422,
      message: "Invalid input",
      details: fieldErrors,
    };
  }

  const existing = await VisitorService.getById(parsed.data.visitorId);
  if (!existing) {
    logger.warn({
      message: "UpdateVisitorUseCase visitor not found",
      visitorId: parsed.data.visitorId,
    });

    throw { status: 404, message: "Visitor not found" };
  }

  const normalizedVisitorName = parsed.data.visitorName.trim().toLowerCase();
  const existingVisitorNameNormalized = existing.visitorName
    ? existing.visitorName.trim().toLowerCase()
    : "";

  if (normalizedVisitorName !== existingVisitorNameNormalized) {
    const duplicate = await VisitorValidator.isDuplicateVisitorName(normalizedVisitorName);
    if (duplicate) {
      logger.warn({
        message: "UpdateVisitorUseCase duplicate visitorName",
        visitorName: normalizedVisitorName,
      });

      throw {
        status: 409,
        message: `visitorName '${normalizedVisitorName}' already exists`,
      };
    }
  }

  const { visitorId, ...rest } = parsed.data;

  try {
    const updatedVisitor = await VisitorService.update(visitorId, {
      ...rest,
      visitorName: normalizedVisitorName,
      visitorUpdatedAt: getLocalNow(),
    });

    logger.info({
      message: "UpdateVisitorUseCase success",
      visitorId,
    });

    return updatedVisitor;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "P2002") {
      logger.warn({
        message:
          "UpdateVisitorUseCase unique constraint violation on visitorName (P2002)",
        visitorName: normalizedVisitorName,
      });

      throw {
        status: 409,
        message: `visitorName '${normalizedVisitorName}' already exists`,
      };
    }

    logger.error({
      message: "UpdateVisitorUseCase error",
      error,
    });

    throw error;
  }
}
