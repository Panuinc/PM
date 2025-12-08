import {
  getAllVisitor,
  createVisitor,
} from "@/app/api/security/visitor/core/visitor.controller";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  return getAllVisitor(request);
}

export async function POST(request) {
  return createVisitor(request);
}
