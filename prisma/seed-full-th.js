import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("🚀 เริ่มสร้างข้อมูลองค์กร ชื้อฮะฮวด อุตสาหกรรม จำกัด ...")

  // ────────────────────────────────
  // 1. ฝ่าย (Department)
  // ────────────────────────────────
  const departments = await prisma.department.createMany({
    data: [
      { departmentName: "ฝ่ายบริหาร", departmentCreatedBy: "system", departmentCreatedAt: new Date() },
      { departmentName: "ฝ่ายขาย", departmentCreatedBy: "system", departmentCreatedAt: new Date() },
      { departmentName: "ฝ่ายผลิต", departmentCreatedBy: "system", departmentCreatedAt: new Date() },
      { departmentName: "ฝ่ายเทคโนโลยีสารสนเทศ (IT)", departmentCreatedBy: "system", departmentCreatedAt: new Date() },
      { departmentName: "ฝ่ายบุคคล", departmentCreatedBy: "system", departmentCreatedAt: new Date() },
      { departmentName: "ฝ่ายบัญชีและการเงิน", departmentCreatedBy: "system", departmentCreatedAt: new Date() },
    ],
  })

  const dep = {}
  for (const d of await prisma.department.findMany()) dep[d.departmentName] = d.departmentId

  // ────────────────────────────────
  // 2. ตำแหน่ง (Role)
  // ────────────────────────────────
  const roles = await prisma.role.createMany({
    data: [
      // บริหาร1
      { roleName: "กรรมการผู้จัดการ", roleCreatedBy: "system", roleCreatedAt: new Date() },

      // ฝ่ายขาย10
      { roleName: "ผู้อำนวยการฝ่ายขาย", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "ผู้จัดการฝ่ายการตลาด", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "ผู้จัดการฝ่ายขายโครงการ", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "ผู้จัดการฝ่ายขายตัวแทนจำหน่าย (Dealer)", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่การตลาดดิจิทัล", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "ผู้สร้างคอนเทนต์", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "นักออกแบบกราฟิก", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่ธุรการฝ่ายขาย", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่ประสานงานฝ่ายขาย", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานขาย", roleCreatedBy: "system", roleCreatedAt: new Date() },

      // ฝ่ายผลิต32
      { roleName: "ผู้จัดการโรงงาน", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "ผู้ช่วยผู้จัดการโรงงาน", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าแผนกวางแผนโครงการ", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าแผนกคลังสินค้า (วัตถุดิบ/สินค้าสำเร็จรูป)", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าแผนกเขียนแบบ/CNC/Robot", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าแผนกผลิต", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าฝ่ายพ่นสี", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าฝ่ายตรวจสอบคุณภาพ (QC)", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าฝ่ายคัดเกรดและบรรจุภัณฑ์", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าแผนกผลิต WPC", roleCreatedBy: "system", roleCreatedAt: new Date() },

      { roleName: "หัวหน้าแผนกขนส่ง", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "หัวหน้าแผนกซ่อมบำรุง", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "ผู้ช่วยหัวหน้าแผนกผลิต", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "ผู้ช่วยหัวหน้าแผนกผลิต WPC", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่คลังสินค้า", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่ธุรการฝ่ายผลิต", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่เขียนแบบ", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่ผลิต CNC/Robot", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงาน CNC", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานเตรียมวัตถุดิบ", roleCreatedBy: "system", roleCreatedAt: new Date() },

      { roleName: "พนักงานประกอบโครง", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานประกอบบาน", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานอัดบาน CTS", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานพ่นสี", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานตรวจสอบคุณภาพ", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานคัดเกรดและบรรจุภัณฑ์", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานฝ่ายผลิต กะ A", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานฝ่ายผลิต กะ B", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานขับรถ", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานเด็กรถ", roleCreatedBy: "system", roleCreatedAt: new Date() },

      { roleName: "ช่างซ่อมบำรุง", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "พนักงานแม่บ้าน", roleCreatedBy: "system", roleCreatedAt: new Date() },

      // IT1
      { roleName: "โปรแกรมเมอร์", roleCreatedBy: "system", roleCreatedAt: new Date() },

      // บุคคล2
      { roleName: "ผู้จัดการฝ่ายบุคคล", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่ฝ่ายบุคคล", roleCreatedBy: "system", roleCreatedAt: new Date() },

      // บัญชี3
      { roleName: "ผู้จัดการฝ่ายบัญชีและการเงิน", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่บัญชีรับ", roleCreatedBy: "system", roleCreatedAt: new Date() },
      { roleName: "เจ้าหน้าที่บัญชีจ่าย", roleCreatedBy: "system", roleCreatedAt: new Date() },
    ],
  })
  const role = {}
  for (const r of await prisma.role.findMany()) role[r.roleName] = r.roleId

  // ────────────────────────────────
  // 3. สิทธิ์ (Permission)
  // ────────────────────────────────
  const permissions = await prisma.permission.createMany({
    data: [
      { permissionName: "ดูแดชบอร์ด", permissionKey: "view_dashboard", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
      { permissionName: "จัดการผู้ใช้งาน", permissionKey: "manage_users", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
      { permissionName: "จัดการสิทธิ์", permissionKey: "manage_roles", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
      { permissionName: "จัดการแผนก", permissionKey: "manage_departments", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
      { permissionName: "จัดการการผลิต", permissionKey: "manage_production", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
      { permissionName: "ดูรายงาน", permissionKey: "view_reports", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
      { permissionName: "จัดการการขาย", permissionKey: "manage_sales", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
      { permissionName: "จัดการบัญชี", permissionKey: "manage_accounting", permissionCreatedBy: "system", permissionCreatedAt: new Date() },
    ],
  })
  const perm = {}
  for (const p of await prisma.permission.findMany()) perm[p.permissionKey] = p.permissionId

  // ────────────────────────────────
  // 4. ผู้ใช้งาน (User)
  // ────────────────────────────────
  const users = [
    { name: "สมชาย บริหารกิจ", email: "ceo@chh.com", dep: dep["ฝ่ายบริหาร"], role: role["กรรมการผู้จัดการ"] },
    { name: "อนันต์ ขายดี", email: "salesdirector@chh.com", dep: dep["ฝ่ายขาย"], role: role["ผู้อำนวยการฝ่ายขาย"] },
    { name: "ศศิ Marketing", email: "marketing@chh.com", dep: dep["ฝ่ายขาย"], role: role["ผู้จัดการฝ่ายการตลาด"] },
    { name: "พรชัย โครงการ", email: "project@chh.com", dep: dep["ฝ่ายขาย"], role: role["ผู้จัดการฝ่ายขายโครงการ"] },
    { name: "กิตติ Dealer", email: "dealer@chh.com", dep: dep["ฝ่ายขาย"], role: role["ผู้จัดการฝ่ายขายตัวแทนจำหน่าย (Dealer)"] },
    { name: "สุพัตรา ผลิต", email: "factory@chh.com", dep: dep["ฝ่ายผลิต"], role: role["ผู้จัดการโรงงาน"] },
    { name: "อารีย์ บุคคล", email: "hr@chh.com", dep: dep["ฝ่ายบุคคล"], role: role["ผู้จัดการฝ่ายบุคคล"] },
    { name: "วราภรณ์ การเงิน", email: "account@chh.com", dep: dep["ฝ่ายบัญชีและการเงิน"], role: role["ผู้จัดการฝ่ายบัญชีและการเงิน"] },
    { name: "ปัญญา ไอที", email: "it@chh.com", dep: dep["ฝ่ายเทคโนโลยีสารสนเทศ (IT)"], role: role["โปรแกรมเมอร์"] },
  ]

  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        userFirstName: u.name.split(" ")[0],
        userLastName: u.name.split(" ")[1],
        userEmail: u.email,
        userPassword: "hashed_password",
        userDepartmentId: u.dep,
        userCreatedBy: "system",
        userCreatedAt: new Date(),
      },
    })
    await prisma.userRole.create({
      data: {
        userRoleUserId: user.userId,
        userRoleRoleId: u.role,
        userRoleCreatedBy: "system",
        userRoleCreatedAt: new Date(),
      },
    })
  }

  // ────────────────────────────────
  // 5. Assign Permission (ตัวอย่าง)
  // ────────────────────────────────
  const ceoRoleId = role["กรรมการผู้จัดการ"]
  for (const key of Object.keys(perm)) {
    await prisma.rolePermission.create({
      data: {
        rolePermissionRoleId: ceoRoleId,
        rolePermissionPermissionId: perm[key],
        rolePermissionCreatedBy: "system",
        rolePermissionCreatedAt: new Date(),
      },
    })
  }

  console.log("✅ นำเข้าข้อมูลองค์กรทั้งหมดเรียบร้อยแล้ว")
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
