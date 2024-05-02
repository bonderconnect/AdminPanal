/**
 * Authorization Roles
 */
const authRoles = {
	superadmin: ['SUPER-ADMIN'],
	admin: ['SUPER-ADMIN', 'ADMIN'],
	faculty: ['SUPER-ADMIN', 'ADMIN', 'FACULTY'],
	onlyGuest: []
};

export default authRoles;
