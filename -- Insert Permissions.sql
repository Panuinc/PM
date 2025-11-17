-- Insert Permissions
INSERT INTO "Permission" ("permissionId", "permissionName", "permissionKey", "permissionStatus", "permissionCreatedBy", "permissionCreatedAt")
VALUES 
-- Dashboard
('perm_dashboard_view', 'Dashboard View', 'dashboard.view', 'Enable', 'system', NOW()),

-- Department
('perm_dept_view', 'Department View', 'department.view', 'Enable', 'system', NOW()),
('perm_dept_create', 'Department Create', 'department.create', 'Enable', 'system', NOW()),
('perm_dept_update', 'Department Update', 'department.update', 'Enable', 'system', NOW()),
('perm_dept_delete', 'Department Delete', 'department.delete', 'Enable', 'system', NOW()),

-- Role
('perm_role_view', 'Role View', 'role.view', 'Enable', 'system', NOW()),
('perm_role_create', 'Role Create', 'role.create', 'Enable', 'system', NOW()),
('perm_role_update', 'Role Update', 'role.update', 'Enable', 'system', NOW()),
('perm_role_delete', 'Role Delete', 'role.delete', 'Enable', 'system', NOW()),

-- Permission
('perm_perm_view', 'Permission View', 'permission.view', 'Enable', 'system', NOW()),
('perm_perm_create', 'Permission Create', 'permission.create', 'Enable', 'system', NOW()),
('perm_perm_update', 'Permission Update', 'permission.update', 'Enable', 'system', NOW()),
('perm_perm_delete', 'Permission Delete', 'permission.delete', 'Enable', 'system', NOW()),

-- Role Permission
('perm_rperm_view', 'Role Permission View', 'rolePermission.view', 'Enable', 'system', NOW()),
('perm_rperm_create', 'Role Permission Create', 'rolePermission.create', 'Enable', 'system', NOW()),
('perm_rperm_update', 'Role Permission Update', 'rolePermission.update', 'Enable', 'system', NOW()),
('perm_rperm_delete', 'Role Permission Delete', 'rolePermission.delete', 'Enable', 'system', NOW()),

-- User
('perm_user_view', 'User View', 'user.view', 'Enable', 'system', NOW()),
('perm_user_create', 'User Create', 'user.create', 'Enable', 'system', NOW()),
('perm_user_update', 'User Update', 'user.update', 'Enable', 'system', NOW()),
('perm_user_delete', 'User Delete', 'user.delete', 'Enable', 'system', NOW()),

-- User Role
('perm_urole_view', 'User Role View', 'userRole.view', 'Enable', 'system', NOW()),
('perm_urole_create', 'User Role Create', 'userRole.create', 'Enable', 'system', NOW()),
('perm_urole_update', 'User Role Update', 'userRole.update', 'Enable', 'system', NOW()),
('perm_urole_delete', 'User Role Delete', 'userRole.delete', 'Enable', 'system', NOW()),

-- User Permission
('perm_uperm_view', 'User Permission View', 'userPermission.view', 'Enable', 'system', NOW()),
('perm_uperm_create', 'User Permission Create', 'userPermission.create', 'Enable', 'system', NOW()),
('perm_uperm_update', 'User Permission Update', 'userPermission.update', 'Enable', 'system', NOW()),
('perm_uperm_delete', 'User Permission Delete', 'userPermission.delete', 'Enable', 'system', NOW()),

-- PM
('perm_pm_dash_view', 'PM Dashboard View', 'pm.dashboard.view', 'Enable', 'system', NOW()),
('perm_pm_machine_view', 'PM Machine View', 'pm.machine.view', 'Enable', 'system', NOW()),
('perm_pm_machine_create', 'PM Machine Create', 'pm.machine.create', 'Enable', 'system', NOW()),
('perm_pm_machine_update', 'PM Machine Update', 'pm.machine.update', 'Enable', 'system', NOW()),
('perm_pm_machine_delete', 'PM Machine Delete', 'pm.machine.delete', 'Enable', 'system', NOW());