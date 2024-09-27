import { RouteInfo } from './sidebar.metadata';
export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Main',
    iconType: '',
    icon: '',
    class: '',
    groupTitle: true,
    badge: '',
    badgeClass: '',
    role: ['All'],
    submenu: [],
  },

  // Admin Modules

  {
    path: '/admin/dashboard/main',
    title: 'Dashboard',
    iconType: 'material-icons-two-tone',
    icon: 'space_dashboard',
    class: '',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [],
  },
  
  // master-data-management
  {
    path: '',
    title: 'Master Data',
    iconType: 'material-icons-two-tone',
    icon: 'dns',
    class: 'menu-toggle',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [
      {
        path: '/master-data-management/categories',
        title: 'Employee',
        iconType: 'material-icons-two-tone',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        role: [''],
        submenu: [],
      }
      
    ]
  },
 
  // faq-management
  {
    path: '',
    title: 'FAQ',
    iconType: 'material-icons-two-tone',
    icon: 'question_answer',
    class: 'menu-toggle',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [
      {
        path: '/faq-management/faq',
        title: 'FAQ Creation',
        iconType: 'material-icons-two-tone',
        icon: '',
        class: 'ml-menu',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        role: [''],
        submenu: [],
      }
      
    ]
  }
 
];