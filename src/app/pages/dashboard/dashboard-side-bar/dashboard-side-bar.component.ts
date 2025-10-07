import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DashboardLayoutService } from '../../../core/services/core/dashboard-layout.service';
import { DashboardMenuItemsComponent } from '../dashboard-menu-items/dashboard-menu-items.component';

@Component({
  selector: 'app-dashboard-side-bar',
  standalone: true,
  imports: [ConfirmDialogModule, DashboardMenuItemsComponent],
  templateUrl: './dashboard-side-bar.component.html',
  styleUrl: './dashboard-side-bar.component.scss',
  providers: [ConfirmationService],
})
export class DashboardSideBarComponent {
  model: any[] = [];
  isAdmin: boolean = false;
  userRole: string = '';

  constructor(
    public layoutService: DashboardLayoutService,
    public el: ElementRef,
    @Inject(PLATFORM_ID) private _PLATFORM_ID: Object,
    private _Router: Router,
    private _ConfirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userRole = user?.role || '';
      this.isAdmin = this.userRole === 'admin'; // Assuming 'super-admin' is now 'admin'
    }
    this.initSideBar();
  }

  initSideBar(): void {
    const fullMenu = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard/home-statistics'],
          },
        ],
      },
      {
        label: 'Insurance Policies',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Medical',
            icon: 'pi pi-fw pi-heart-fill',
            items: [
              {
                label: 'Create Policy',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['/dashboard/menu/create-medical-policy'],
              },
              ...(this.isAdmin
                ? [
                  {
                    label: 'View Policies',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/dashboard/menu/medical-insurances'],
                  },
                ]
                : []),
            ],
          },
          {
            label: 'Motor',
            icon: 'pi pi-fw pi-car',
            items: [
              {
                label: 'Create Policy',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['/dashboard/menu/create-motor-policy'],
              },
              ...(this.isAdmin
                ? [
                  {
                    label: 'View Policies',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/dashboard/menu/motor-insurances'],
                  },
                ]
                : []),
            ],
          },
          {
            label: 'Property',
            icon: 'pi pi-fw pi-building',
            items: [
              {
                label: 'Create Policy',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['/dashboard/menu/create-building-policy'],
              },
              ...(this.isAdmin
                ? [
                  {
                    label: 'View Policies',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/dashboard/menu/building-insurances'],
                  },
                ]
                : []),
            ],
          },
          {
            label: 'Professional',
            icon: 'pi pi-fw pi-briefcase',
            items: [
              {
                label: 'Create Policy',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['/dashboard/menu/create-jop-policy'],
              },
              ...(this.isAdmin
                ? [
                  {
                    label: 'View Policies',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/dashboard/menu/jop-insurances'],
                  },
                ]
                : []),
            ],
          },
        ],
      },
      {
        label: 'Claims Management',
        icon: 'pi pi-fw pi-file-edit',
        items: [
          {
            label: 'Medical Reimbursement',
            icon: 'pi pi-fw pi-heart',
            routerLink: ['/dashboard/menu/medical-claims'],
          },
          {
            label: 'Motor Claims',
            icon: 'pi pi-fw pi-file-edit',
            routerLink: ['/dashboard/menu/motor-claims'],
          },
          {
            label: 'Property Claims',
            icon: 'pi pi-fw pi-file',
            routerLink: ['/dashboard/menu/building-claims'],
          },
          {
            label: 'Professional Claims',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/dashboard/menu/jop-claims'],
          },
        ],
      },
      {
        label: 'Requests & Leads',
        icon: 'pi pi-fw pi-inbox',
        items: [
          {
            label: 'Medical Requests',
            icon: 'pi pi-fw pi-send',
            routerLink: ['/dashboard/menu/medical-requests'],
          },
          {
            label: 'Motor Requests',
            icon: 'pi pi-fw pi-forward',
            routerLink: ['/dashboard/menu/motor-requests'],
          },
          {
            label: 'professional Requests',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/dashboard/menu/jop-requests'],
          },
          {
            label: 'Property Requests',
            icon: 'pi pi-fw pi-replay',
            routerLink: ['/dashboard/menu/building-requests'],
          },
          {
            label: 'Leads',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['/dashboard/menu/leads/all-leads'],
          },
        ],
      },
      {
        label: 'Configuration',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Medical Settings',
            icon: 'pi pi-fw pi-heart',
            items: [
              {
                label: 'Add Medical Choice',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['/dashboard/menu/medical/add-medical-choice'],
              },
            ],
          },
          {
            label: 'Motor Settings',
            icon: 'pi pi-fw pi-car',
            items: [
              {
                label: 'Add Motor Choice',
                icon: 'pi pi-fw pi-plus',
                routerLink: ['/dashboard/menu/motor/add-motor-choice'],
              },
              {
                label: 'Car Brands',
                icon: 'pi pi-fw pi-bookmark',
                routerLink: ['/dashboard/menu/car-brands'],
              },
              {
                label: 'Car Models',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/dashboard/menu/car-models'],
              },
              {
                label: 'Car Types',
                icon: 'pi pi-fw pi-tag',
                routerLink: ['/dashboard/menu/car-types'],
              },
            ],
          },
          {
            label: 'Property Settings',
            icon: 'pi pi-fw pi-building',
            items: [
              {
                label: 'Add Property Choice',
                icon: 'pi pi-fw pi-plus',
                routerLink: ['/dashboard/menu/building/add-building-choice'],
              },
              {
                label: 'Property Types',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/dashboard/menu/build-types'],
              },
              {
                label: 'Property Countries',
                icon: 'pi pi-fw pi-globe',
                routerLink: ['/dashboard/menu/build-countries'],
              },
            ],
          },
          {
            label: 'Professional  Settings',
            icon: 'pi pi-fw pi-briefcase',
            items: [
              {
                label: 'Add Professional  Choice',
                icon: 'pi pi-fw pi-plus-circle',
                routerLink: ['/dashboard/menu/jop/add-jop-choice'],
              },
            ],
          },
        ],
      },
      {
        label: 'User Management',
        items: [
          {
            label: 'Users',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/dashboard/menu/all-users'],
          },
          {
            label: 'Employees',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/dashboard/menu/all-employees'],
          },
        ],
      },
      {
        label: 'Content Management',
        items: [
          {
            label: 'Sliders',
            icon: 'pi pi-fw pi-images',
            routerLink: ['/dashboard/menu/sliders'],
          },
          {
            label: 'Testimonials',
            icon: 'pi pi-fw pi-comment',
            routerLink: ['/dashboard/menu/testimonials'],
          },
          {
            label: 'English Blogs',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/dashboard/menu/en-blogs'],
          },
          {
            label: 'Arabic Blogs',
            icon: 'pi pi-fw pi-bookmark-fill',
            routerLink: ['/dashboard/menu/ar-blogs'],
          },
          {
            label: 'Categories',
            icon: 'pi pi-fw pi-tags',
            routerLink: ['/dashboard/menu/categories'],
          },
          {
            label: 'Partners',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: ['/dashboard/menu/partners'],
          },
          {
            label: 'Counters',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/dashboard/menu/counters'],
          },
          {
            label: 'Features',
            icon: 'pi pi-fw pi-star',
            routerLink: ['/dashboard/menu/features'],
          },
          {
            label: 'Claims Information',
            icon: 'pi pi-fw pi-history',
            routerLink: ['/dashboard/menu/claim-info'],
          },
          {
            label: 'Clients',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/dashboard/menu/clients'],
          },
          {
            label: 'Administrations',
            icon: 'pi pi-fw pi-user-edit',
            routerLink: ['/dashboard/menu/adminstrations'],
          },
        ],
      },
      {
        label: 'Communication',
        items: [
          {
            label: 'Contact Form',
            icon: 'pi pi-fw pi-envelope',
            routerLink: ['/dashboard/menu/contact-form'],
          },
          {
            label: 'Social Links',
            icon: 'pi pi-fw pi-share-alt',
            routerLink: ['/dashboard/menu/social-links'],
          },
          {
            label: 'Send Notifications',
            icon: 'pi pi-bell',
            routerLink: ['/dashboard/menu/send-notification'],
          },
          {
            label: 'Expire Notifications',
            icon: 'pi pi-clock',
            routerLink: ['/dashboard/menu/expire-notifications'],
          },
          {
            label: 'Admin Notifications',
            icon: 'pi pi-inbox',
            routerLink: ['/dashboard/menu/admin-notifications'],
          },
        ],
      },
      {
        label: 'Marketing & Resources',
        items: [
          {
            label: 'About Information',
            icon: 'pi pi-fw pi-download',
            routerLink: ['/dashboard/menu/about-us'],
          },
          {
            label: 'Downloads About',
            icon: 'pi pi-fw pi-download',
            routerLink: ['/dashboard/menu/download-info'],
          },
          // {
          //   label: 'Privacy Policy',
          //   icon: 'pi pi-fw pi-file',
          //   routerLink: ['/dashboard/menu/privacy-policy'],
          // },
        ],
      },
      {
        label: 'Account',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => this.logout(),
          },
        ],
      },
    ];

    // Filter menu for employees (up to Configuration)
    this.model = this.isAdmin
      ? fullMenu
      : fullMenu.filter((menu) =>
        [
          'Home',
          'Insurance Policies',
          'Claims Management',
          'Requests & Leads',
          'Account',
        ].includes(menu.label)
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this._Router.navigate(['/login']);
  }
}
