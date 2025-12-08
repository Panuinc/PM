import { VisitorRepository } from "@/app/api/security/visitor/core/visitor.repository";

export const VisitorValidator = {
  async exists(visitorId) {
    if (!visitorId || typeof visitorId !== "string") {
      throw {
        status: 400,
        message: "Invalid visitorId",
      };
    }
    const existing = await VisitorRepository.findById(visitorId);
    return !!existing;
  },
};