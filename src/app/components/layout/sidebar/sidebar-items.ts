import { RouteInfo } from './sidebar.metadata';
export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: '',
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
    iconType: '',
    icon: '../../../../assets/images/banner/dashboard.png',
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
    iconType: '',
    icon: '../../../../assets/images/banner/master-data.png',
    class: 'menu-toggle',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [
      {
        path: 'employee-management',
        title: 'Employee',
        iconType: '',
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
  {
    path: '',
    title: 'On Behalf Booking',
    iconType: '',
    icon: '../../../../assets/images/banner/schedule.png',
    class: 'menu-toggle',
    groupTitle: false,
    badge: '',
    badgeClass: '',
    role: ['Admin'],
    submenu: [
      {
        path: '/booking-management/booking-setup',
        title: 'Booking Setup',
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
  // {
  //   path: '',
  //   title: 'FAQ',
  //   iconType: 'material-icons-two-tone',
  //   icon: 'question_answer',
  //   class: 'menu-toggle',
  //   groupTitle: false,
  //   badge: '',
  //   badgeClass: '',
  //   role: ['Admin'],
  //   submenu: [
  //     {
  //       path: '/faq-management/faq',
  //       title: 'FAQ Creation',
  //       iconType: 'material-icons-two-tone',
  //       icon: '',
  //       class: 'ml-menu',
  //       groupTitle: false,
  //       badge: '',
  //       badgeClass: '',
  //       role: [''],
  //       submenu: [],
  //     }
      
  //   ]
  // }
 
];