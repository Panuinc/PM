import { VisitorRepository } from "@/app/api/security/visitor/core/visitor.repository";

export const VisitorValidator = {
  async isDuplicateVisitorName(visitorName) {
    if (!visitorName || typeof visitorName !== "string") {
      throw {
        status: 400,
        message: "Invalid visitorName",
      };
    }

    const existing = await VisitorRepository.findByVisitorName(visitorName);
    return !!existing;
  },
};
