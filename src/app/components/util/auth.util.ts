import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

const DASHBOARD_PATH = '/admin/dashboard/main';
const QM_PATH = '/question-management';
const QM_PLAYER_REVIEW_PATH = '/question-management/player-review';
const PM_PATH = "/product-management";
const OR_PATH = "/organization-management"
const AM_PATH='/assessment-management';
const MDM_PATH = '/master-data-management';
const COUPON_MANAGEMENT_PATH = "/coupon-management";
const CRM_PATH = '/carousel-management';
const TST_PATH = '/testimonial-management';
const STR_PATH = '/story-management';
const FAQ_PATH = '/faq-management';
const WPG_PATH = '/webpage-management';
const APS_PATH = '/adaptive-practice-settings';
const B2B_APS_PATH = '/b2b-adaptive-practice-settings'
const COIN_PATH = '/coin-management';
const ORD_PATH = '/order-management';
const STD_RPRT_PATH = '/student-report-management';

@Injectable({
  providedIn: 'root',
})
export class AuthUtil {
  roleMatching = [
    {
      urlPattern: DASHBOARD_PATH,
      roles: ['*'],
    },
    {
      urlPattern: '/products',
      roles: ['CREATE_PRODUCT', 'UPDATE_PRODUCT', 'VIEW_PRODUCT'],
    },
    {
      urlPattern: '/identity',
      roles: [
        'CREATE_ROLE',
        'UPDATE_ROLE',
        'VIEW_ROLE',
        'CREATE_USER',
        'VIEW_USER',
        'UPDATE_USER',
      ],
    },
    {
      urlPattern: '/identity/roles',
      roles: ['CREATE_ROLE', 'UPDATE_ROLE', 'VIEW_ROLE'],
    },
    {
      urlPattern: '/identity/users',
      roles: ['CREATE_USER', 'VIEW_USER', 'UPDATE_USER'],
    },
    {
      urlPattern: '/student-management',
      roles: [
        'CREATE_ROLE',
        'UPDATE_ROLE',
        'VIEW_ROLE',
        'CREATE_USER',
        'VIEW_USER',
        'UPDATE_USER',
      ],
    },
    {
      urlPattern: '/student-management/roles',
      roles: ['CREATE_ROLE', 'UPDATE_ROLE', 'VIEW_ROLE'],
    },
    {
      urlPattern: '/student-management/students',
      roles: ['CREATE_USER', 'VIEW_USER', 'UPDATE_USER'],
    },
    { urlPattern: QM_PATH, roles: ['*'] },
    { urlPattern: OR_PATH, roles: ['*'] },
    { urlPattern: QM_PLAYER_REVIEW_PATH, roles: ['*'] },
    { urlPattern: PM_PATH, roles: ["*"] },
    { urlPattern: AM_PATH, roles: ["*"] },
    { urlPattern: MDM_PATH, roles: ['*'] },
    { urlPattern: COUPON_MANAGEMENT_PATH, roles: ["*"] },
    { urlPattern: CRM_PATH, roles: ['*'] },
    { urlPattern: TST_PATH, roles: ['*'] },
    { urlPattern: STR_PATH, roles: ['*'] },
    { urlPattern: FAQ_PATH, roles: ['*'] },
    { urlPattern: WPG_PATH, roles: ['*'] },
	  { urlPattern: APS_PATH, roles: ['*'] },
    { urlPattern: B2B_APS_PATH, roles: ['*'] },
    { urlPattern: COIN_PATH, roles: ['*'] },
    { urlPattern: ORD_PATH, roles: ['*'] },
    { urlPattern: STD_RPRT_PATH, roles: ['*'] },
  ];

  constructor(private router: Router, public snackBar: MatSnackBar) { }

  checkRoleForEachUrl(state: any, permissions: string[]) {
    const matchedUrl = this.roleMatching.filter((el) =>
      this.match(el.urlPattern, state.url)
    )[0];
    if (
      matchedUrl.urlPattern == DASHBOARD_PATH ||
      matchedUrl.urlPattern.indexOf(QM_PATH) > -1 ||
      matchedUrl.urlPattern == QM_PLAYER_REVIEW_PATH ||
      matchedUrl.urlPattern == PM_PATH ||
      matchedUrl.urlPattern == OR_PATH ||
      matchedUrl.urlPattern == AM_PATH ||
      matchedUrl.urlPattern == MDM_PATH ||
      matchedUrl.urlPattern == COUPON_MANAGEMENT_PATH ||
      matchedUrl.urlPattern ==  CRM_PATH ||
      matchedUrl.urlPattern ==  TST_PATH ||
      matchedUrl.urlPattern ==  STR_PATH ||
      matchedUrl.urlPattern ==  FAQ_PATH ||
      matchedUrl.urlPattern ==  WPG_PATH ||
      matchedUrl.urlPattern ==  APS_PATH ||
      matchedUrl.urlPattern ==  B2B_APS_PATH ||
      matchedUrl.urlPattern ==  COIN_PATH ||
      matchedUrl.urlPattern ==  ORD_PATH ||
      matchedUrl.urlPattern ==  STD_RPRT_PATH
    ) {
      return true;
    } else if (matchedUrl.urlPattern != DASHBOARD_PATH) {
      return permissions.some((r: string) => matchedUrl.roles.includes(r));
    } else {
      this.snackBar.open(`Not authorised to view this page!!`, '', {
        duration: 2000,
      });
      this.router.navigateByUrl(DASHBOARD_PATH);
      return false;
    }
  }

  match(pattern: any, path: any) {
    return path.startsWith(pattern);
  }
}
