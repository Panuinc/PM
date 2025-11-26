import {
  getAllDelivery,
  createDelivery,
} from "@/app/api/logistic/delivery/core/delivery.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  return getAllDelivery(request);
}

export async function POST(request) {
  return createDelivery(request);
}
