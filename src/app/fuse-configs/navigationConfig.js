import { authRoles } from 'app/auth';
import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'usersmanagement',
		title: 'Users',
		translate: 'USERS_AN_PROFILES_NAV_HEAD',
		type: 'group',
		auth: authRoles.admin,
		icon: 'peopleAlt',
		children: [
			{
				id: 'usersmanagement-all-users',
				title: 'All Users',
				translate: 'ALLUSERS',
				type: 'item',
				icon: 'people',
				url: '/apps/users'
			},
			{
				id: 'userManagement-all-agentProfiles',
				title: 'All Agent profiles',
				translate: 'AGENT_PROFILES',
				type: 'item',
				icon: 'account_box',
				url: '/apps/agents'
			},
			{
				id: 'userManagement-all-customerProfiles',
				title: 'All Customers profiles',
				translate: 'CUSTOMER_PROFILES',
				type: 'item',
				icon: 'face',
				url: '/apps/customers'
			},
			{
				id: 'userManagement-all-truckDriverProfiles',
				title: 'All Truck driver profiles',
				translate: 'TRUCK_DRIVER_PROFILES',
				type: 'item',
				icon: 'local_shipping',
				url: '/apps/truck-drivers'
			},
			{
				id: 'userManagement-all-constructionMaterialsCompanyProfiles',
				title: 'All Construction materials company profiles',
				translate: 'CONSTRUCTION_MATERIALS_COMPANY_PROFILES',
				type: 'item',
				icon: 'domain',
				url: '/apps/construction-materials-company-profiles'
			},
			{
				id: 'userManagement-all-serviceCompanyProfiles',
				title: 'All Service company profiles',
				translate: 'SERVICE_COMPANY_PROFILES',
				type: 'item',
				icon: 'build',
				url: '/apps/service-company-profiles'
			},
			{
				id: 'userManagement-all-machineryCompanyProfiles',
				title: 'All Machinery company profiles',
				translate: 'MACHINERY_COMPANY_PROFILES',
				type: 'item',
				icon: 'category',
				url: '/apps/machinery-company-profiles'
			}
		]
	},
	{
		id: 'usersContents',
		title: 'Product, Services & Machineries',
		translate: 'PRODUCTS / SERVICES / MACHINERIES',
		type: 'group',
		icon: 'listAlt',
		children: [
			{
				id: 'products',
				title: 'Products',
				translate: 'PRODUCTS',
				type: 'item',
				auth: authRoles.admin,
				icon: 'domain',
				url: '/apps/products-from-profiles'
			},
			{
				id: 'services',
				title: 'Services',
				translate: 'SERVICES',
				type: 'item',
				auth: authRoles.admin,
				icon: 'build',
				url: '/apps/services-from-profiles'
			},
			{
				id: 'machineries',
				title: 'Machineries',
				translate: 'MACHINERIES',
				type: 'item',
				auth: authRoles.admin,
				icon: 'category',
				url: '/apps/machineries-from-profiles'
			}
		]
	},
	{
		id: 'general',
		title: 'General',
		translate: 'PACKAGES / SUBSCRIPTIONS',
		type: 'group',
		icon: 'listAlt',
		children: [
			{
				id: 'packages',
				title: 'Packages',
				translate: 'PACKAGES',
				type: 'item',
				auth: authRoles.admin,
				icon: 'local_mall',
				url: '/apps/packages'
			},
			{
				id: 'subscriptions',
				title: 'Subscriptions',
				translate: 'SUBSCRIPTIONS',
				type: 'item',
				auth: authRoles.admin,
				icon: 'attach_money',
				url: '/apps/subscriptions'
			}
		]
	},
	{
		id: 'analytics',
		title: 'Analytics',
		translate: 'Anaytics',
		type: 'group',
		icon: 'analytics',
		children: []
	},
	{
		id: 'categories',
		title: 'Categories',
		translate: 'CATEGORIES',
		type: 'group',
		icon: 'listAlt',
		children: [
			{
				id: 'service',
				title: 'Service',
				translate: 'SERVICES',
				type: 'item',
				auth: authRoles.admin,
				icon: 'local_mall',
				url: '/apps/categories/service'
			},
			{
				id: 'machinery',
				title: 'Machinery',
				translate: 'MACHINERY',
				type: 'item',
				auth: authRoles.admin,
				icon: 'attach_money',
				url: '/apps/categories/machinery'
			},
			{
				id: 'materials',
				title: 'Materials',
				translate: 'MATERIALS',
				type: 'item',
				auth: authRoles.admin,
				icon: 'attach_money',
				url: '/apps/categories/construction-materials'
			}
		]
	},
	{
		id: 'ads',
		title: 'Advertisements',
		translate: 'ADVERTISEMENTS',
		type: 'group',
		icon: 'listAlt',
		children: [
			{
				id: 'userAds',
				title: 'User Advertisements',
				translate: 'USER_ADS',
				type: 'item',
				auth: authRoles.admin,
				icon: 'local_mall',
				url: '/apps/ads'
			}
		]
	}
];

export default navigationConfig;
