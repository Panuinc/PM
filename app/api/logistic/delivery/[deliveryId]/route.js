import {
  getDeliveryById,
  updateDelivery,
} from "@/app/api/logistic/delivery/core/delivery.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request, context) {
  const { deliveryId } = await context.params;
  return getDeliveryById(request, String(deliveryId));
}

export async function PUT(request, context) {
  const { deliveryId } = await context.params;
  return updateDelivery(request, String(deliveryId));
}
