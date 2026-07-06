import { MedicalRequestCommentsResolver } from './core/guards/medical-request-comments.resolver';
import { MedicalRequestsResolver } from './core/guards/medical-requests.resolver';
import { motorCategoriesInsuranceResolver } from './core/guards/motors-categories-insurance.resolver';
import { Routes } from '@angular/router';
import { authGuard } from './auth/gurd/auth.guard';
import { loginGuard } from './auth/gurd/login.guard';
import { adminstrationsResolver } from './core/guards/adminstrations.resolver';
import { AllLeadsResolver } from './core/guards/all-leads.resolver';
import { ArabicBlogsResolver } from './core/guards/arabic-blogs.resolver';
import { BuildCountriesWithTypes } from './core/guards/build-countries.resolver';
import { buildTypesResolver } from './core/guards/build-types.resolver';
import { buildingChoices2Resolver } from './core/guards/building-choices-2.resolver';
import { BuildingClaimsCommentsResolver } from './core/guards/building-claims-comments.resolver';
import { BuildingClaimResolver } from './core/guards/building-claims.resolver';
import { buildingLeadsResolver } from './core/guards/building-leads-resolver.resolver';
import { CarAddEditModelsResolver } from './core/guards/car-add-edit-models.resolver';
import { CarBrandsResolver } from './core/guards/car-brands.resolver';
import { CarModelsResolver } from './core/guards/car-models.resolver';
import { carTypesResolver } from './core/guards/car-types.resolver';
import { CarYearsResolver } from './core/guards/car-years.resolver';
import { CategoriesResolver } from './core/guards/categories.resolver';
import { ClientsResolver } from './core/guards/clients.resolver';
import { CountersResolver } from './core/guards/common.resolver';
import { ContactFormResolver } from './core/guards/contact-form.resolver';
import { buildingPolicyResolver } from './core/guards/create-building-policy.resolver';
import { jopPolicyResolver } from './core/guards/create-jop-policy.resolver';
import { medicalPolicyResolver } from './core/guards/create-medical-policy.resolver';
import { motorPolicyResolver } from './core/guards/create-motor-policy.resolver';
import { EnglishBlogsResolver } from './core/guards/en-blogs.resolver';
import { FeaturesResolver } from './core/guards/features.resolver';
import { JobClaimResolver } from './core/guards/jop-claim.resolver';
import { JobClaimsCommentsResolver } from './core/guards/jop-claims-comments.resolver';
import { jopInsuranceChoicesResolver } from './core/guards/jop-insurance-choices-resolver';
import { JopInsuranceChoicesResolver } from './core/guards/jop-insurances-choices.resolver';
import { JopInsurancesResolver } from './core/guards/jop-insurances.resolver';
import { JobRequestCommentsResolver } from './core/guards/jop-request-comments.resolver';
import { JobRequestsResolver } from './core/guards/jop-requests.resolver';
import { medicalCatgoriesInsuranceResolver } from './core/guards/medical-catgories-insurance.resolver';
import { medicalClaimResolver } from './core/guards/medical-claim.resolver';
import { MedicalClaimsCommentsResolver } from './core/guards/medical-claims-comments.resolver';
import { MedicalInsuranceChoicesResolver } from './core/guards/medical-insurances-choices.resolver';
import { MedicalInsurancesResolver } from './core/guards/medical-insurances.resolver';
import { medicalLeadsResolver } from './core/guards/medical-leads.resolver';
import { MotorClaimResolver } from './core/guards/motor-claim.resolver';
import { MotorInsuranceChoicesResolver } from './core/guards/motor-insurances-choices.resolver';
import { MotorInsurancesResolver } from './core/guards/motor-insurances.resolver';
import { motorLeadsResolver } from './core/guards/motor-leads-resolver.resolver';
import { MotorRequestsCommentsResolver } from './core/guards/motor-requests-comments.resolver';
import { MotorRequestsResolver } from './core/guards/motor-requests.resolver';
import { MotorClaimsCommentsResolver } from './core/guards/motors-claims-comments.resolver';
import { PartnersResolver } from './core/guards/parteners.resolver';
import { propertCategoriesInsuranceResolver } from './core/guards/propert-categories-insurance.resolver';
import { PropertyInsuranceChoicesResolver } from './core/guards/property-insurances-choices.resolver';
import { PropertyInsurancesResolver } from './core/guards/property-insurances.resolver';
import { BuildingRequestCommentsResolver } from './core/guards/property-request-comments.resolver';
import { propertyRequestResolver } from './core/guards/property-request.resolver';
import { SlidersResolver } from './core/guards/sliders.resolver';
import { TestimonialsResolver } from './core/guards/testimonials.resolver';
import { UserResolver } from './core/guards/users.resolver';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { roleGuard } from './core/role/role-guard.guard';
import { jopLeadsResolver } from './jop-insurance/res/guards/building-leads-resolver.resolver';
import { darnaBlogsResolver } from './pages/dashboard/dashboard-pages/darna-blogs/darna-blogs.resolver';
import { HomeStatisticsComponent } from './pages/dashboard/dashboard-pages/home-statistics/home-statistics.component';
import { JInternetConnectionComponent } from './pages/dashboard/dashboard-pages/j-internet-connection/j-internet-connection.component';
import { AddEditJopInsuranceComponent } from './pages/dashboard/dashboard-pages/jop-insurance/components/add-edit-jop-insurance/add-edit-jop-insurance.component';
import { AllJopInsuranceComponent } from './pages/dashboard/dashboard-pages/jop-insurance/components/all-jop-insurance/all-jop-insurance.component';
import { ViewJopInsuranceComponent } from './pages/dashboard/dashboard-pages/jop-insurance/components/view-jop-insurance/view-jop-insurance.component';
import { AddJopChoiceComponent } from './pages/dashboard/dashboard-pages/jop-insurances-choices/add-jop-choice/add-jop-choice.component';
import { AddEditJopInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/jop-insurances-choices/components/add-edit-jop-insurances-choices/add-edit-jop-insurances-choices.component';
import { AllJopInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/jop-insurances-choices/components/all-jop-insurances-choices/all-jop-insurances-choices.component';
import { ViewJopInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/jop-insurances-choices/components/view-jop-insurances-choices/view-jop-insurances-choices.component';
import { AddEditMedicalChoiceComponent } from './pages/dashboard/dashboard-pages/medical-insurances-choices/components/add-edit-medical-insurances-choices/add-edit-medical-insurances-choices.component';
import { AddMedicalChoiceComponent } from './pages/dashboard/dashboard-pages/medical-insurances-choices/components/add-medical-choice/add-medical-choice.component';
import { AllMedicalInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/medical-insurances-choices/components/all-medical-insurances-choices/all-medical-insurances-choices.component';
import { ViewMedicalInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/medical-insurances-choices/components/view-medical-insurances-choices/view-medical-insurances-choices.component';
import { AddEditMedicalInsurancesComponent } from './pages/dashboard/dashboard-pages/medical-insurances/components/add-edit-medical-insurances/add-edit-medical-insurances.component';
import { AllMedicalInsurancesComponent } from './pages/dashboard/dashboard-pages/medical-insurances/components/all-medical-insurances/all-medical-insurances.component';
import { ViewMedicalInsurancesComponent } from './pages/dashboard/dashboard-pages/medical-insurances/components/view-medical-insurances/view-medical-insurances.component';
import { AddEditMotorInsuranceComponent } from './pages/dashboard/dashboard-pages/motor-insurance/components/add-edit-motor-insurance/add-edit-motor-insurance.component';
import { AllMotorInsuranceComponent } from './pages/dashboard/dashboard-pages/motor-insurance/components/all-motor-insurance/all-motor-insurance.component';
import { ViewMotorInsuranceComponent } from './pages/dashboard/dashboard-pages/motor-insurance/components/view-motor-insurance/view-motor-insurance.component';
import { AddEditMotorInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/motor-insurances-choices/components/add-edit-motor-insurances-choices/add-edit-motor-insurances-choices.component';
import { AddMotorChoiceComponent } from './pages/dashboard/dashboard-pages/motor-insurances-choices/components/add-motor-choice/add-motor-choice.component';
import { AllMotorInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/motor-insurances-choices/components/all-motor-insurances-choices/all-motor-insurances-choices.component';
import { ViewMotorInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/motor-insurances-choices/components/view-motor-insurances-choices/view-motor-insurances-choices.component';
import { AddEditPropertyInsuranceComponent } from './pages/dashboard/dashboard-pages/property-insurance/components/add-edit-property-insurance/add-edit-property-insurance.component';
import { AllPropertyInsuranceComponent } from './pages/dashboard/dashboard-pages/property-insurance/components/all-property-insurance/all-property-insurance.component';
import { ViewPropertyInsuranceComponent } from './pages/dashboard/dashboard-pages/property-insurance/components/view-property-insurance/view-property-insurance.component';
import { AddBuildingChoiceComponent } from './pages/dashboard/dashboard-pages/property-insurances-choices/add-building-choice/add-building-choice.component';
import { AddEditPropertyInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/property-insurances-choices/components/add-edit-property-insurances-choices/add-edit-property-insurances-choices.component';
import { AllPropertyInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/property-insurances-choices/components/all-property-insurances-choices/all-property-insurances-choices.component';
import { ViewPropertyInsurancesChoicesComponent } from './pages/dashboard/dashboard-pages/property-insurances-choices/components/view-property-insurances-choices/view-property-insurances-choices.component';
export const routes: Routes = [
  // ===============================================
  // AUTHENTICATION ROUTES
  // ===============================================
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/components/login/login.component').then(
            (c) => c.LoginComponent
          ),
        title: 'Capital - Login',
      },
    ],
  },

  // ===============================================
  // DASHBOARD ROUTES
  // ===============================================
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./core/layouts/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
    canActivate: [loginGuard, roleGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/dashboard/dashboard-pages/dashboard-pages.component'
          ).then((c) => c.DashboardPagesComponent),
        title: 'Capital Dashboard',
        children: [
          // Default redirect to home statistics
          {
            path: '',
            redirectTo: 'home-statistics',
            pathMatch: 'full',
          },

          // ===============================================
          // HOME & STATISTICS
          // ===============================================
          {
            path: 'home-statistics',
            component: HomeStatisticsComponent,
            title: 'Dashboard Statistics',
          },

          // ===============================================
          // DASHBOARD MENU ROUTES
          // ===============================================
          {
            path: 'menu',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/c-dashboard-menu/c-dashboard-menu.component'
              ).then((c) => c.CDashboardMenuComponent),
            title: 'Capital Dashboard Menu',
            children: [
              // ===============================================
              // CONTENT MANAGEMENT ROUTES
              // ===============================================

              // --- SLIDERS MANAGEMENT ---
              {
                path: 'sliders',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/sliders/components/sliders-page/sliders-page.component'
                  ).then((c) => c.SlidersPageComponent),
                title: 'Capital ',
                children: [
                  { path: '', redirectTo: 'sliders-index', pathMatch: 'full' },
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/sliders/components/all-sliders/all-sliders.component'
                      ).then((c) => c.AllSlidersComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/sliders/components/view-slider/view-slider.component'
                      ).then((c) => c.ViewSliderComponent),
                    title: 'Capital ',
                    resolve: {
                      data: SlidersResolver,
                    },
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/sliders/components/add-edit-slider/add-edit-slider.component'
                      ).then((c) => c.AddEditSliderComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/sliders/components/add-edit-slider/add-edit-slider.component'
                      ).then((c) => c.AddEditSliderComponent),
                    title: 'Capital Website ',
                    resolve: {
                      data: SlidersResolver,
                    },
                  },
                ],
              },

              // --- CLIENTS MANAGEMENT ---
              {
                path: 'clients',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/clients/components/clients-page/clients-page.component'
                  ).then((c) => c.ClientsPageComponent),
                title: 'Capital ',
                children: [
                  { path: '', redirectTo: 'clients-index', pathMatch: 'full' },
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/clients/components/all-clients/all-clients.component'
                      ).then((c) => c.AllClientsComponent),
                    title: 'Capital ',
                    resolve: {
                      data: ClientsResolver,
                    },
                  },
                  {
                    path: 'view/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/clients/components/view-client/view-client.component'
                      ).then((c) => c.ViewClientComponent),
                    title: 'Capital ',
                    resolve: {
                      data: ClientsResolver,
                    },
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/clients/components/add-edit-client/add-edit-client.component'
                      ).then((c) => c.AddEditClientComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/clients/components/add-edit-client/add-edit-client.component'
                      ).then((c) => c.AddEditClientComponent),
                    title: 'Capital Website ',
                    resolve: {
                      data: ClientsResolver,
                    },
                  },
                ],
              },

              // --- TESTIMONIALS MANAGEMENT ---
              {
                path: 'testimonials',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/testimonials/components/testimonials-page/testimonials-page.component'
                  ).then((c) => c.TestimonialsPageComponent),
                title: 'Capital ',
                children: [
                  { path: '', redirectTo: 'clients-index', pathMatch: 'full' },
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/testimonials/components/all-testimonials/all-testimonials.component'
                      ).then((c) => c.AllTestimonialsComponent),
                    title: 'Capital ',
                    resolve: {
                      data: TestimonialsResolver,
                    },
                  },
                  {
                    path: 'view/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/testimonials/components/view-testimonial/view-testimonial.component'
                      ).then((c) => c.ViewTestimonialComponent),
                    title: 'Capital ',
                    resolve: {
                      data: TestimonialsResolver,
                    },
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/testimonials/components/add-edit-testimonial/add-edit-testimonial.component'
                      ).then((c) => c.AddEditTestimonialComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/testimonials/components/add-edit-testimonial/add-edit-testimonial.component'
                      ).then((c) => c.AddEditTestimonialComponent),
                    title: 'Capital Website ',
                    resolve: {
                      data: TestimonialsResolver,
                    },
                  },
                ],
              },

              // ===============================================
              // BLOG MANAGEMENT ROUTES
              // ===============================================

              // --- ARABIC BLOGS ---
              {
                path: 'ar-blogs',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/arabic-blogs/componets/arabic-blogs-page/arabic-blogs-page.component'
                  ).then((c) => c.ArabicBlogsPageComponent),
                title: 'Capital ',
                children: [
                  { path: '', redirectTo: 'ar-blogs-index', pathMatch: 'full' },
                  {
                    path: 'ar-blogs-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/arabic-blogs/componets/all-arabic-blogs/all-arabic-blogs.component'
                      ).then((c) => c.AllArabicBlogsComponent),
                    title: 'Capital ',
                    resolve: {
                      data: ArabicBlogsResolver,
                    },
                  },
                  {
                    path: 'view/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/arabic-blogs/componets/view-arabic-blog/view-arabic-blog.component'
                      ).then((c) => c.ViewArabicBlogComponent),
                    resolve: {
                      data: ArabicBlogsResolver,
                    },
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/arabic-blogs/componets/add-edit-arabic-blogs/add-edit-arabic-blogs.component'
                      ).then((c) => c.AddEditArabicBlogsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/arabic-blogs/componets/add-edit-arabic-blogs/add-edit-arabic-blogs.component'
                      ).then((c) => c.AddEditArabicBlogsComponent),
                    title: 'Capital Website ',
                    resolve: {
                      data: ArabicBlogsResolver,
                    },
                  },
                ],
              },

              // --- ENGLISH BLOGS ---
              {
                path: 'en-blogs',
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/english-blogs/components/all-eng-blogs/all-eng-blogs.component'
                      ).then((c) => c.AllEngBlogsComponent),
                    resolve: {
                      data: EnglishBlogsResolver, // Only needed for edit route
                    },
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/english-blogs/components/add-edit-eng-blog/add-edit-eng-blog.component'
                      ).then((c) => c.AddEnglishBlogComponent),
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/english-blogs/components/add-edit-eng-blog/add-edit-eng-blog.component'
                      ).then((c) => c.AddEnglishBlogComponent),
                    resolve: {
                      data: EnglishBlogsResolver, // Only needed for edit route
                    },
                  },
                  {
                    path: 'view/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/english-blogs/components/all-eng-blogs/all-eng-blogs.component'
                      ).then((c) => c.AllEngBlogsComponent),
                    resolve: {
                      data: EnglishBlogsResolver, // Only needed for edit route
                    },
                  },
                ],
              },

              // --- BLOG CATEGORIES ---
              {
                path: 'categories',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/categories/components/categories-page/categories-page.component'
                  ).then((c) => c.CategoriesPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'categories-index',
                    pathMatch: 'full',
                  },
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/categories/components/all-categories/all-categories.component'
                      ).then((c) => c.AllCategoriesComponent),
                    title: 'Capital ',
                    resolve: {
                      data: CategoriesResolver,
                    },
                  },
                  {
                    path: 'view-category/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/categories/components/view-category/view-category.component'
                      ).then((c) => c.ViewCategoryComponent),
                    title: 'Capital ',
                    resolve: {
                      data: CategoriesResolver,
                    },
                  },
                  // {
                  //   path: 'add-category',
                  //   loadComponent: () =>
                  //     import(
                  //       './pages/dashboard/dashboard-pages/categories/components/add-edit-category/add-edit-category.component'
                  //     ).then((c) => c.AddEditCategoryComponent),
                  //   data: {
                  //     title: 'Capital ',
                  //     description: 'Dashboard Page',
                  //   },
                  // },
                  {
                    path: 'edit-category/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/categories/components/add-edit-category/add-edit-category.component'
                      ).then((c) => c.AddEditCategoryComponent),
                    title: 'Capital Website ',
                    resolve: {
                      data: CategoriesResolver,
                    },
                  },
                ],
              },

              // ===============================================
              // MARKETING & PROMOTIONAL CONTENT
              // ===============================================

              // --- PARTNERS MANAGEMENT ---
              {
                path: 'partners',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/parteners/components/parteners-page/parteners-page.component'
                  ).then((c) => c.PartenersPageComponent),
                title: 'Capital ',
                children: [
                  { path: '', redirectTo: 'partners-index', pathMatch: 'full' },
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/parteners/components/all-partenerss/all-partenerss.component'
                      ).then((c) => c.AllPartenerssComponent),
                    title: 'Capital ',
                    resolve: {
                      data: PartnersResolver,
                    },
                  },
                  {
                    path: 'view/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/parteners/components/view-parteners/view-parteners.component'
                      ).then((c) => c.ViewPartenersComponent),
                    title: 'Capital ',
                    resolve: {
                      data: PartnersResolver,
                    },
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/parteners/components/add-edit-parteners/add-edit-parteners.component'
                      ).then((c) => c.AddEditPartnersComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/parteners/components/add-edit-parteners/add-edit-parteners.component'
                      ).then((c) => c.AddEditPartnersComponent),
                    title: 'Capital Website ',
                    resolve: {
                      data: PartnersResolver,
                    },
                  },
                ],
              },

              // --- COUNTERS MANAGEMENT ---
              {
                path: 'counters',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/counters/components/counters-page/counters-page.component'
                  ).then((c) => c.CountersPageComponent),
                title: 'Capital ',
                children: [
                  { path: '', redirectTo: 'counters-index', pathMatch: 'full' },
                  {
                    path: 'counters-index',
                    resolve: {
                      counters: CountersResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/counters/components/all-counters/all-counters.component'
                      ).then((c) => c.AllCountersComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-counter/:id',
                    resolve: {
                      counter: CountersResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/counters/components/view-counters/view-counters.component'
                      ).then((c) => c.ViewCountersComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add-counter',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/counters/components/add-edit-counters/add-edit-counters.component'
                      ).then((c) => c.AddEditCountersComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit-counter/:id',
                    resolve: {
                      data: CountersResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/counters/components/add-edit-counters/add-edit-counters.component'
                      ).then((c) => c.AddEditCountersComponent),
                    title: 'Capital Website ',
                  },
                ],
              },

              // --- FEATURES MANAGEMENT ---
              {
                path: 'features',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/features/components/features-page/features-page.component'
                  ).then((c) => c.FeaturesPageComponent),
                title: 'Capital ',
                children: [
                  { path: '', redirectTo: 'features-index', pathMatch: 'full' },
                  {
                    path: 'features-index',
                    resolve: {
                      feature: FeaturesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/features/components/all-features/all-features.component'
                      ).then((c) => c.AllFeaturesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-feature/:id',
                    resolve: {
                      feature: FeaturesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/features/components/view-features/view-features.component'
                      ).then((c) => c.ViewFeaturesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add-feature',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/features/components/add-edit-features/add-edit-features.component'
                      ).then((c) => c.AddEditFeaturesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit-feature/:id',
                    resolve: {
                      data: FeaturesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/features/components/add-edit-features/add-edit-features.component'
                      ).then((c) => c.AddEditFeaturesComponent),
                    title: 'Capital Website ',
                  },
                ],
              },

              // ===============================================
              // COMMUNICATION & ADMINISTRATION
              // ===============================================

              // --- SOCIAL LINKS ---
              {
                path: 'social-links',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/social-links/social-links/social-links.component'
                  ).then((c) => c.SocialLinksComponent),
                title: 'Capital ',
              },
              // --- Send notifications ---
              {
                path: 'send-notification',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/send-notification/send-notification/send-notification.component'
                  ).then((c) => c.SendNotificationComponent),
                title: 'Capital',
              },
              // --- expire notifications
              {
                path: 'expire-notifications',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/expire-notification/expire-notification/expire-notification.component'
                  ).then((c) => c.ExpireNotificationComponent),
                title: 'Capital',
              },
              // --- admin notifications
              {
                path: 'admin-notifications',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/admin-notifications/admin-notifications/admin-notifications.component'
                  ).then((c) => c.AdminNotificationsComponent),
                title: 'Capital',
              },
              // --- ADMINISTRATION MANAGEMENT ---
              {
                path: 'adminstrations',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/adminstrations/components/adminstrations-page/adminstrations-page.component'
                  ).then((c) => c.AdminstrationsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'adminstrations-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'adminstrations-index',
                    resolve: {
                      adminstration: adminstrationsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/adminstrations/components/all-adminstrations/all-adminstrations.component'
                      ).then((c) => c.AllAdminstrationsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-adminstration/:id',
                    resolve: {
                      adminstration: adminstrationsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/adminstrations/components/view-adminstrations/view-adminstrations.component'
                      ).then((c) => c.ViewAdminstrationsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/adminstrations/components/add-edit-adminstrations/add-edit-adminstrations.component'
                      ).then((c) => c.AddEditAdminstrationsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: adminstrationsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/adminstrations/components/add-edit-adminstrations/add-edit-adminstrations.component'
                      ).then((c) => c.AddEditAdminstrationsComponent),
                    title: 'Capital Website ',
                  },
                ],
              },

              // --- CONTACT FORM MANAGEMENT ---
              {
                path: 'contact-form',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/contact-form/components/contact-form-page/contact-form-page.component'
                  ).then((c) => c.ContactFormPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'contact-form-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'contact-form-index',
                    resolve: {
                      data: ContactFormResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/contact-form/components/all-contact-form/all-contact-form.component'
                      ).then((c) => c.AllContactFormComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-contact-form/:id',
                    resolve: {
                      data: ContactFormResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/contact-form/components/view-contact-form/view-contact-form.component'
                      ).then((c) => c.ViewContactFormComponent),
                    title: 'Capital ',
                  },
                ],
              },

              // ===============================================
              // SYSTEM CONFIGURATION
              // ===============================================

              // --- PROPERTY CONFIGURATION ---
              // Build Types Management
              {
                path: 'build-types',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/build-types/components/build-types-page/build-types-page.component'
                  ).then((c) => c.BuildTypesPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'build-types-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'build-types-index',
                    resolve: {
                      data: buildTypesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-types/components/all-build-types/all-build-types.component'
                      ).then((c) => c.AllBuildTypesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view/:id',
                    resolve: {
                      data: buildTypesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-types/components/view-build-types/view-build-types.component'
                      ).then((c) => c.ViewBuildTypesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-types/components/add-edit-build-types/add-edit-build-types.component'
                      ).then((c) => c.AddEditBuildTypesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-types/components/add-edit-build-types/add-edit-build-types.component'
                      ).then((c) => c.AddEditBuildTypesComponent),
                    title: 'Capital ',
                    resolve: {
                      data: buildTypesResolver,
                    },
                  },
                ],
              },

              // Build Countries Management
              {
                path: 'build-countries',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/build-countries/components/build-countries-page/build-countries-page.component'
                  ).then((c) => c.BuildCountriesPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'build-countries-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'build-countries-index',
                    resolve: {
                      data: BuildCountriesWithTypes,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-countries/components/all-build-countries/all-build-countries.component'
                      ).then((c) => c.AllBuildCountriesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view/:id',
                    resolve: {
                      data: BuildCountriesWithTypes,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-countries/components/view-build-countries/view-build-countries.component'
                      ).then((c) => c.ViewBuildCountriesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: BuildCountriesWithTypes,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-countries/components/add-edit-build-countries/add-edit-build-countries.component'
                      ).then((c) => c.AddEditBuildCountriesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    resolve: {
                      data: BuildCountriesWithTypes,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/build-countries/components/add-edit-build-countries/add-edit-build-countries.component'
                      ).then((c) => c.AddEditBuildCountriesComponent),
                    title: 'Capital ',
                  },
                ],
              },

              // --- MOTOR CONFIGURATION ---
              // Car Types Management
              {
                path: 'car-types',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/car-types/components/car-types-page/car-types-page.component'
                  ).then((c) => c.CarTypesPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'car-types-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'car-types-index',
                    resolve: {
                      data: carTypesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-types/components/all-car-types/all-car-types.component'
                      ).then((c) => c.AllCarTypesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view/:id',
                    resolve: {
                      data: carTypesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-types/components/view-car-types/view-car-types.component'
                      ).then((c) => c.ViewCarTypesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-types/components/add-edit-car-types/add-edit-car-types.component'
                      ).then((c) => c.AddEditCarTypesComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-types/components/add-edit-car-types/add-edit-car-types.component'
                      ).then((c) => c.AddEditCarTypesComponent),
                    title: 'Capital ',
                    resolve: {
                      data: carTypesResolver,
                    },
                  },
                ],
              },
              {
                path: 'car-years',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/car-years/components/car-years-page/car-years-page.component'
                  ).then((c) => c.CarYearsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'car-years-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'car-years-index',
                    resolve: {
                      data: CarYearsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-years/components/all-car-years/all-car-years.component'
                      ).then((c) => c.AllCarYearsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view/:id',
                    resolve: {
                      data: CarYearsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-years/components/view-car-years/view-car-years.component'
                      ).then((c) => c.ViewCarYearsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: CarYearsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-years/components/edit-year/edit-year.component'
                      ).then((c) => c.EditYearComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    resolve: {
                      data: CarYearsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-years/components/add-year/add-year.component'
                      ).then((c) => c.AddYearComponent),
                    title: 'Capital ',
                  },
                ],
              },
              {
                path: 'car-models',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/car-model/components/car-model-page/car-model-page.component'
                  ).then((c) => c.CarModelPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'car-models-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'car-models-index',
                    resolve: {
                      data: CarModelsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-model/components/all-car-model/all-car-model.component'
                      ).then((c) => c.AllCarModelComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-car-model/:id',
                    resolve: {
                      data: CarModelsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-model/components/view-car-model/view-car-model.component'
                      ).then((c) => c.ViewCarModelComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: CarAddEditModelsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-model/components/add-edit-car-model/add-edit-car-model.component'
                      ).then((c) => c.AddEditCarModelsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    resolve: {
                      data: CarModelsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-model/components/add-edit-car-model/add-edit-car-model.component'
                      ).then((c) => c.AddEditCarModelsComponent),
                    title: 'Capital ',
                  },
                ],
              },
              {
                path: 'car-brands',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/car-brands/components/car-brands-page/car-brands-page.component'
                  ).then((c) => c.CarBrandsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'car-brands-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'car-brands-index',
                    resolve: {
                      data: CarBrandsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-brands/components/all-car-brands/all-car-brands.component'
                      ).then((c) => c.AllCarBrandsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-car-brand/:id',
                    resolve: {
                      // data: CarBrandsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-brands/components/view-car-brands/view-car-brands.component'
                      ).then((c) => c.ViewCarBrandsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: CarBrandsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-brands/components/edit-brand/edit-brand.component'
                      ).then((c) => c.EditCarBrandComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'add',
                    resolve: {
                      data: CarBrandsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/car-brands/components/add-brand/add-brand.component'
                      ).then((c) => c.AddCarBrandComponent),
                    title: 'Capital ',
                  },
                ],
              },

              // ===============================================
              // INSURANCE MANAGEMENT
              // ===============================================

              // --- MEDICAL INSURANCE CONFIGURATION ---
              {
                path: 'medical/add-medical-choice',
                component: AddMedicalChoiceComponent,
                resolve: { data: medicalCatgoriesInsuranceResolver },
              },

              // --- MOTOR INSURANCE CONFIGURATION ---
              {
                path: 'motor/add-motor-choice',
                component: AddMotorChoiceComponent,
                resolve: { data: motorCategoriesInsuranceResolver },
              },

              // --- PROPERTY INSURANCE CONFIGURATION ---
              {
                path: 'building/add-building-choice',
                component: AddBuildingChoiceComponent,
                resolve: { data: buildingChoices2Resolver },
              },
              {
                path: 'jop/add-jop-choice',
                component: AddJopChoiceComponent,
                resolve: { data: jopInsuranceChoicesResolver },
                pathMatch: 'full',
              },

              // --- MEDICAL INSURANCES MANAGEMENT ---
              {
                path: 'medical-insurances',
                runGuardsAndResolvers: 'always',
                children: [
                  {
                    path: '',
                    component: AllMedicalInsurancesComponent,
                    pathMatch: 'full',
                  },
                  //   {
                  //     path: 'add-medical-choice',
                  //     component: AddMedicalChoiceComponent,
                  //     resolve: { data: medicalCatgoriesInsuranceResolver },
                  //  },
                  {
                    path: 'create',
                    component: AddEditMedicalInsurancesComponent,
                  },
                  {
                    path: 'view/:id',
                    component: ViewMedicalInsurancesComponent,
                    resolve: { data: MedicalInsurancesResolver },
                  },
                  {
                    path: 'edit/:id',
                    component: AddEditMedicalInsurancesComponent,
                    resolve: { data: MedicalInsurancesResolver },
                  },
                  {
                    path: 'choices/:id',

                    children: [
                      {
                        path: '',
                        component: AllMedicalInsurancesChoicesComponent,
                        resolve: { data: MedicalInsuranceChoicesResolver },
                        pathMatch: 'full',
                      },

                      {
                        path: 'edit/:choiceId',
                        component: AddEditMedicalChoiceComponent,
                        resolve: {
                          data: MedicalInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      {
                        path: 'view/:choiceId',
                        component: ViewMedicalInsurancesChoicesComponent,
                        resolve: {
                          data: MedicalInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      // http://localhost:4200/dashboard/menu/medical-insurances/choices/1/add%2F1
                      {
                        path: 'add/:choiceId',
                        component: AddEditMedicalChoiceComponent,

                        pathMatch: 'full',
                      },
                    ],
                  },
                ],
              },

              // --- MOTOR INSURANCES MANAGEMENT ---
              {
                path: 'motor-insurances',
                runGuardsAndResolvers: 'always',
                children: [
                  {
                    path: '',
                    component: AllMotorInsuranceComponent,
                    pathMatch: 'full',
                    title: 'Capital',
                  },

                  {
                    path: 'create',
                    component: AddEditMotorInsuranceComponent,
                  },
                  {
                    path: 'view/:id',
                    component: ViewMotorInsuranceComponent,
                    resolve: { data: MotorInsurancesResolver },
                  },
                  {
                    path: 'edit/:id',
                    component: AddEditMotorInsuranceComponent,
                    resolve: { data: MotorInsurancesResolver },
                  },
                  {
                    path: 'choices/:id',

                    children: [
                      {
                        path: '',
                        component: AllMotorInsurancesChoicesComponent,
                        // resolve: { data: MotorInsuranceChoicesResolver },
                        pathMatch: 'full',
                      },

                      {
                        path: 'edit/:choiceId',
                        component: AddEditMotorInsurancesChoicesComponent,
                        resolve: {
                          data: MotorInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      {
                        path: 'view/:choiceId',
                        component: ViewMotorInsurancesChoicesComponent,
                        resolve: {
                          data: MotorInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      // http://localhost:4200/dashboard/menu/medical-insurances/choices/1/add%2F1
                      {
                        path: 'add/:choiceId',
                        component: AddEditMotorInsurancesChoicesComponent,

                        pathMatch: 'full',
                      },
                    ],
                  },
                ],
              },
              // jop insurance
              // --- JOP INSURANCES MANAGEMENT ---
              // {
              //   path: 'jop-insurances',
              //   runGuardsAndResolvers: 'always',
              //   children: [
              //     {
              //       path: '',
              //       component: AllJopInsuranceComponent,
              //       pathMatch: 'full',
              //       data: {
              //         title: 'Capital aaaaaaaaa',
              //         description: 'Dashboard Page',
              //       },
              //     },

              //     // {
              //     //   path: 'create',
              //     //   component: AddEditMotorInsuranceComponent,
              //     // },
              //     // {
              //     //   path: 'view/:id',
              //     //   component: ViewMotorInsuranceComponent,
              //     //   resolve: { data: MotorInsurancesResolver },
              //     // },
              //     // {
              //     //   path: 'edit/:id',
              //     //   component: AddEditMotorInsuranceComponent,
              //     //   resolve: { data: MotorInsurancesResolver },
              //     // },
              //     // {
              //     //   path: 'choices/:id',

              //     //   children: [
              //     //     {
              //     //       path: '',
              //     //       component: AllMotorInsurancesChoicesComponent,
              //     //       // resolve: { data: MotorInsuranceChoicesResolver },
              //     //       pathMatch: 'full',
              //     //     },

              //     //     {
              //     //       path: 'edit/:choiceId',
              //     //       component: AddEditMotorInsurancesChoicesComponent,
              //     //       resolve: {
              //     //         data: MotorInsuranceChoicesResolver,
              //     //       },
              //     //       pathMatch: 'full',
              //     //     },
              //     //     {
              //     //       path: 'view/:choiceId',
              //     //       component: ViewMotorInsurancesChoicesComponent,
              //     //       resolve: {
              //     //         data: MotorInsuranceChoicesResolver,
              //     //       },
              //     //       pathMatch: 'full',
              //     //     },
              //     //     // http://localhost:4200/dashboard/menu/medical-insurances/choices/1/add%2F1
              //     //     {
              //     //       path: 'add/:choiceId',
              //     //       component: AddEditMotorInsurancesChoicesComponent,

              //     //       pathMatch: 'full',
              //     //     },
              //     //   ],
              //     // },
              //   ],
              // },

              // ===============================================
              // REQUESTS & CLAIMS MANAGEMENT
              // ===============================================

              // --- MEDICAL REQUEST COMMENTS ---
              {
                path: 'medical-request',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/medical-request-comment/components/medical-request-comment-page/medical-request-comment-page.component'
                  ).then((c) => c.MedicalRequestCommentPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'medical-request-comments-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: MedicalRequestCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-request-comment/components/all-medical-request-comment/all-medical-request-comment.component'
                      ).then((c) => c.AllMedicalRequestCommentComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-medical-request-comment/:id',
                    resolve: {
                      data: MedicalRequestCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-request-comment/components/view-medical-request-comment/view-medical-request-comment.component'
                      ).then((c) => c.ViewMedicalRequestCommentComponent),
                    title: 'Capital ',
                  },
                ],
              },

              // --- MEDICAL REQUESTS ---
              {
                path: 'medical-requests',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/medical-requests/components/medical-requests-page/medical-requests-page.component'
                  ).then((c) => c.MedicalRequestsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'medical-requests-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'medical-requests-index',
                    resolve: {
                      data: MedicalRequestsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-requests/components/all-medical-requests/all-medical-requests.component'
                      ).then((c) => c.AllMedicalRequestsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: medicalCatgoriesInsuranceResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-requests/components/add-edit-medical-requests/add-edit-medical-requests.component'
                      ).then((c) => c.AddEditMedicalRequestsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-medical-request/:id',
                    resolve: {
                      data: MedicalRequestsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-requests/components/view-medical-requests/view-medical-requests.component'
                      ).then((c) => c.ViewMedicalRequestsComponent),
                    title: 'Capital ',
                  },
                ],
              },
              // motor requests
              {
                path: 'motor-requests',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/motors-requests/components/motors-requests-page/motors-requests-page.component'
                  ).then((c) => c.MotorsRequestsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'motor-requests-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'motor-requests-index',
                    resolve: {
                      data: MotorRequestsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-requests/components/all-motors-requests/all-motors-requests.component'
                      ).then((c) => c.AllMotorsRequestsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: motorCategoriesInsuranceResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-requests/components/add-edit-motors-requests/add-edit-motors-requests.component'
                      ).then((c) => c.AddEditMotorsRequestsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-motor-request/:id',
                    resolve: {
                      data: MotorRequestsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-requests/components/view-motors-requests/view-motors-requests.component'
                      ).then((c) => c.ViewMotorsRequestsComponent),
                    title: 'Capital ',
                  },
                ],
              },
              // motor requests comments
              {
                path: 'motor-requests',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/motors-comments/components/motors-comments-page/motors-comments-page.component'
                  ).then((c) => c.MotorsCommentsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: MotorRequestsCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-comments/components/all-motors-comments/all-motors-comments.component'
                      ).then((c) => c.AllMotorsCommentsComponent),
                    title: 'Capital ',
                  },
                ],
              },
              // property requests
              {
                path: 'building-requests',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/property-requests/components/property-requests-page/property-requests-page.component'
                  ).then((c) => c.PropertyRequestsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'building-requests-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'building-requests-index',
                    resolve: {
                      data: propertyRequestResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/property-requests/components/all-property-requests/all-property-requests.component'
                      ).then((c) => c.AllPropertyRequestsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: propertCategoriesInsuranceResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/property-requests/components/add-edit-property-requests/add-edit-property-requests.component'
                      ).then((c) => c.AddEditPropertyRequestsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-building-request/:id',
                    resolve: {
                      data: propertyRequestResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/property-requests/components/view-property-requests/view-property-requests.component'
                      ).then((c) => c.ViewPropertyRequestsComponent),
                    title: 'Capital ',
                  },
                ],
              },
              {
                path: 'privacy-policy',
                runGuardsAndResolvers: 'always',

                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/privacy-policy/privacy-policy.component'
                  ).then((c) => c.PrivacyPolicyComponent),
              },
              //property insurance
              {
                path: 'building-insurances',
                runGuardsAndResolvers: 'always',
                children: [
                  {
                    path: '',
                    component: AllPropertyInsuranceComponent,
                    pathMatch: 'full',
                  },

                  {
                    path: 'create',
                    component: AddEditPropertyInsuranceComponent,
                  },
                  {
                    path: 'view/:id',
                    component: ViewPropertyInsuranceComponent,
                    resolve: { data: PropertyInsurancesResolver },
                  },
                  {
                    path: 'edit/:id',
                    component: AddEditPropertyInsuranceComponent,
                    resolve: { data: PropertyInsurancesResolver },
                  },
                  {
                    path: 'choices/:id',

                    children: [
                      {
                        path: '',
                        component: AllPropertyInsurancesChoicesComponent,
                        // resolve: { data: MotorInsuranceChoicesResolver },
                        pathMatch: 'full',
                      },

                      {
                        path: 'edit/:choiceId',
                        component: AddEditPropertyInsurancesChoicesComponent,
                        resolve: {
                          data: PropertyInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      {
                        path: 'view/:choiceId',
                        component: ViewPropertyInsurancesChoicesComponent,
                        resolve: {
                          data: PropertyInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      // http://localhost:4200/dashboard/menu/medical-insurances/choices/1/add%2F1
                      {
                        path: 'add/:choiceId',
                        component: AddEditPropertyInsurancesChoicesComponent,
                        pathMatch: 'full',
                      },
                    ],
                  },
                ],
              },
              /* Here Will Implement Jop Insurance */
              {
                path: 'jop-insurances',
                runGuardsAndResolvers: 'always',
                children: [
                  {
                    path: '',
                    component: AllJopInsuranceComponent,
                    pathMatch: 'full',
                  },

                  {
                    path: 'create',
                    component: AddEditJopInsuranceComponent,
                  },
                  {
                    path: 'view/:id',
                    component: ViewJopInsuranceComponent,
                    resolve: { data: JopInsurancesResolver },
                  },
                  {
                    path: 'edit/:id',
                    component: AddEditJopInsuranceComponent,
                    resolve: { data: JopInsurancesResolver },
                  },
                  {
                    path: 'choices/:id',

                    children: [
                      {
                        path: '',
                        component: AllJopInsurancesChoicesComponent,
                        // resolve: { data: JopInsuranceChoicesResolver },
                        pathMatch: 'full',
                      },

                      {
                        path: 'edit/:choiceId',
                        component: AddEditJopInsurancesChoicesComponent,
                        resolve: {
                          data: JopInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      {
                        path: 'view/:choiceId',
                        component: ViewJopInsurancesChoicesComponent,
                        resolve: {
                          data: JopInsuranceChoicesResolver,
                        },
                        pathMatch: 'full',
                      },
                      // http://localhost:4200/dashboard/menu/jop-insurances/choices/1/add%2F1
                      {
                        path: 'add/:choiceId',
                        component: AddEditJopInsurancesChoicesComponent,

                        pathMatch: 'full',
                      },
                    ],
                  },
                ],
              },

              //property comments
              {
                path: 'building-request',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/property-comments/components/property-comments-page/property-comments-page.component'
                  ).then((c) => c.PropertyCommentsPageComponent),
                title: 'Capital ',
                children: [
                  {
                    path: '',
                    redirectTo: 'medical-request-comments-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: BuildingRequestCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/property-comments/components/all-property-comments/all-property-comments.component'
                      ).then((c) => c.AllPropertyCommentsComponent),
                    title: 'Capital ',
                  },
                ],
              }, // medical claims
              {
                path: 'medical-claims',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/medical-claims/components/medical-claims-page/medical-claims-page.component'
                  ).then((c) => c.MedicalClaimsPageComponent),
                title: 'Capital',
                children: [
                  {
                    path: '',
                    redirectTo: 'medical-claims-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'medical-claims-index',
                    resolve: {
                      data: medicalClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-claims/components/all-medical-claims/all-medical-claims.component'
                      ).then((c) => c.AllMedicalClaimsComponent),
                    title: 'Capital',
                  },

                  {
                    path: 'view-medical-claim/:id',
                    resolve: {
                      data: medicalClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-claims/components/view-medical-claims/view-medical-claims.component'
                      ).then((c) => c.ViewMedicalClaimsComponent),
                    title: 'Capital',
                  },
                ],
              },

              // medical claims comments
              {
                path: 'medical-claims',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/medical-claims-comments/components/medical-claims-comments-page/medical-claims-comments-page.component'
                  ).then((c) => c.MedicalClaimsCommentsPageComponent),
                title: 'Capital',
                children: [
                  {
                    path: '',
                    redirectTo: 'medical-claims-comments-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: MedicalClaimsCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-claims-comments/components/all-medical-claims-comments/all-medical-claims-comments.component'
                      ).then((c) => c.AllMedicalClaimsCommentsComponent),
                    title: 'Capital',
                  },
                ],
              },

              {
                path: 'building-claims',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/building-claims/components/building-claims-page/building-claims-page.component'
                  ).then((c) => c.BuildingClaimsPageComponent),
                title: 'Capital',
                children: [
                  { path: '', redirectTo: 'building-index', pathMatch: 'full' },
                  {
                    path: 'building-index',
                    resolve: {
                      data: BuildingClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/building-claims/components/all-building-claims/all-building-claims.component'
                      ).then((c) => c.AllBuildingClaimsComponent),
                    title: 'Capital',
                  },
                  {
                    path: 'view-building-claim/:id',
                    resolve: {
                      data: BuildingClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/building-claims/components/view-building-claims/view-building-claims.component'
                      ).then((c) => c.ViewBuildingClaimsComponent),
                    title: 'Capital',
                  },
                ],
              },
              {
                path: 'building-claims',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/building-claims-comments/components/building-claims-comments-page/building-claims-comments-page.component'
                  ).then((c) => c.BuildingClaimsCommentsPageComponent),
                title: 'Capital',
                children: [
                  {
                    path: '',
                    redirectTo: 'building-comments-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: BuildingClaimsCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/building-claims-comments/components/all-building-claims-comments/all-building-claims-comments.component'
                      ).then((c) => c.AllBuildingClaimsCommentsComponent),
                    title: 'Capital',
                  },
                ],
              },

              {
                path: 'motor-claims',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/motors-claims/components/motors-claims-page/motors-claims-page.component'
                  ).then((c) => c.MotorsClaimsPageComponent),
                title: 'Capital',
                children: [
                  { path: '', redirectTo: 'motor-index', pathMatch: 'full' },
                  {
                    path: 'motor-index',
                    resolve: {
                      data: MotorClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-claims/components/all-motors-claims/all-motors-claims.component'
                      ).then((c) => c.AllMotorsClaimsComponent),
                    title: 'Capital',
                  },
                  {
                    path: 'view-motor-claim/:id',
                    resolve: {
                      data: MotorClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-claims/components/view-motors-claims/view-motors-claims.component'
                      ).then((c) => c.ViewMotorsClaimsComponent),
                    title: 'Capital',
                  },
                ],
              },
              {
                path: 'motor-claims',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/motors-clims-comments/components/motors-clims-comments-page/motors-clims-comments-page.component'
                  ).then((c) => c.MotorsClimsCommentsPageComponent),
                title: 'Capital',
                children: [
                  {
                    path: '',
                    redirectTo: 'motor-comments-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: MotorClaimsCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-clims-comments/components/all-motors-clims-comments/all-motors-clims-comments.component'
                      ).then((c) => c.AllMotorClaimsCommentsComponent),
                    title: 'Capital',
                  },
                ],
              },

              // JOB CLAIMS MANAGEMENT
              {
                path: 'jop-claims',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/jop-claims/components/jop-claims-page/jop-claims-page.component'
                  ).then((c) => c.JopClaimsPageComponent),
                title: 'Capital',
                children: [
                  { path: '', redirectTo: 'jop-index', pathMatch: 'full' },
                  {
                    path: 'jop-index',
                    resolve: {
                      data: JobClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/jop-claims/components/all-jop-claims/all-jop-claims.component'
                      ).then((c) => c.AllJopClaimsComponent),
                    title: 'Capital',
                  },
                  {
                    path: 'view-jop-claim/:id',
                    resolve: {
                      data: JobClaimResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/jop-claims/components/view-jop-claims/view-jop-claims.component'
                      ).then((c) => c.ViewJopClaimsComponent),
                  },
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: JobClaimsCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/jop-claims/components/all-jop-claims-comments/all-jop-claims-comments.component'
                      ).then((c) => c.AllJopClaimsCommentsComponent),
                    title: 'Capital',
                  },
                ],
              },

              // JOB REQUESTS MANAGEMENT
              {
                path: 'jop-requests',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/jop-requests/components/jop-requests-page/jop-requests-page.component'
                  ).then((c) => c.JopRequestsPageComponent),
                title: 'Capital',
                children: [
                  {
                    path: '',
                    redirectTo: 'jop-requests-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'jop-requests-index',
                    resolve: {
                      data: JobRequestsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/jop-requests/components/all-jop-requests/all-jop-requests.component'
                      ).then((c) => c.AllJopRequestsComponent),
                    title: 'Capital',
                  },
                  {
                    path: 'edit/:id',
                    resolve: {
                      data: JobRequestsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/jop-requests/components/add-edit-jop-requests/add-edit-jop-requests.component'
                      ).then((c) => c.AddEditJopRequestsComponent),
                    title: 'Capital',
                  },
                  {
                    path: 'view/:id',
                    resolve: {
                      data: JobRequestsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/jop-requests/components/view-jop-requests/view-jop-requests.component'
                      ).then((c) => c.ViewJopRequestsComponent),
                    title: 'Capital',
                  },
                ],
              },

              // JOB REQUEST COMMENTS
              {
                path: 'jop-request',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/jop-comments/components/jop-comments-page/jop-comments-page.component'
                  ).then((c) => c.JopCommentsPageComponent),
                title: 'Capital',
                children: [
                  {
                    path: '',
                    redirectTo: 'jop-comments-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'comments/:id',
                    resolve: {
                      data: JobRequestCommentsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/jop-comments/components/all-jop-comments/all-jop-comments.component'
                      ).then((c) => c.AllJopCommentsComponent),
                    title: 'Capital',
                  },
                ],
              },

              {
                path: 'edit-darna-blogs/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/darna-blogs/edit-darna-blogs/edit-darna-blogs.component'
                  ).then((c) => c.EditBlogComponent),
                title: 'Capital',
                resolve: {
                  data: darnaBlogsResolver,
                },
              },

              {
                path: 'add-darna-blogs',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/darna-blogs/darna-blogs.component'
                  ).then((c) => c.DarnaBlogsComponent),
                title: 'Capital',
                resolve: {
                  data: darnaBlogsResolver,
                },
              },
              {
                path: 'darna-blogs',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/darna-blogs/all-darna-blogs/all-darna-blogs.component'
                  ).then((c) => c.AllDarnaBlogsComponent),
                title: 'Capital',
              },

              {
                path: 'darna-projects',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/darna-projects/all-darna-projects/all-darna-projects.component'
                  ).then((c) => c.AllDarnaProjectsComponent),
                title: 'Capital',
              },
              {
                path: 'edit-darna-projects/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/darna-projects/add-edit-darna-projects/add-edit-darna-projects.component'
                  ).then((c) => c.AddEditDarnaProjectsComponent),
                title: 'Capital',
              },
              {
                path: 'add-darna-projects',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/darna-projects/add-darna/add-darna.component'
                  ).then((c) => c.AddDarnaComponent),
                title: 'Capital',
              },
              {
                path: 'all-darna-projects',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/darna-projects/all-darna-projects/all-darna-projects.component'
                  ).then((c) => c.AllDarnaProjectsComponent),
                title: 'Capital',
              },

              // ===============================================
              // POLICY CREATION
              // ===============================================

              // --- CREATE MEDICAL POLICY ---
              {
                path: 'create-medical-policy',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/create_policies/create-medical-policy/create-medical-policy.component'
                  ).then((c) => c.CreateMedicalPolicyComponent),
                title: 'Capital',
                resolve: {
                  data: medicalPolicyResolver,
                },
              },

              // --- CREATE MOTOR POLICY ---
              {
                path: 'create-motor-policy',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/create_policies/create-motor-policy/create-motor-policy.component'
                  ).then((c) => c.CreateMotorPolicyComponent),
                title: 'Capital',
                resolve: {
                  data: motorPolicyResolver,
                },
              },

              // --- CREATE PROPERTY POLICY ---
              {
                path: 'create-building-policy',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/create_policies/create-building-policy/create-building-policy.component'
                  ).then((c) => c.CreateBuildingPolicyComponent),
                title: 'Capital',
                resolve: {
                  data: buildingPolicyResolver,
                },
              },

              // --- CREATE JOP POLICY ---
              {
                path: 'create-jop-policy',
                loadComponent: () =>
                  import(
                    './jop-insurance/create-jop-request/create-request.component'
                  ).then((c) => c.CreateJopPolicy),
                title: 'Capital',
                resolve: {
                  data: jopPolicyResolver,
                },
              },

              // ===============================================
              // INFORMATION PAGES
              // ===============================================

              // --- CLAIMS INFORMATION ---
              {
                path: 'claim-info',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/claims-info/claim-info/claim-info.component'
                  ).then((c) => c.ClaimInfoComponent),
                title: 'Capital',
                // resolve: {
                //   // data: claimInfoResolver,
                // },
              },

              // --- ABOUT US PAGE ---
              {
                path: 'about-us',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/about-us/about-us.component'
                  ).then((c) => c.AboutUsComponent),
                title: 'Capital',
              },

              // ===============================================
              // LEADS MANAGEMENT
              // ===============================================
              {
                path: 'leads',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/all-leads/all-leads-page/all-leads-page.component'
                  ).then((c) => c.AllLeadsPageComponent),
                children: [
                  {
                    path: '',
                    redirectTo: 'all-leads',
                    pathMatch: 'full',
                  },
                  {
                    path: 'all-leads',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/all-leads/all-leads/all-leads.component'
                      ).then((c) => c.AllLeadsComponent),
                    title: 'Capital ',
                    resolve: {
                      data: AllLeadsResolver,
                    },
                  },
                  {
                    path: 'view-motor-lead/:id',
                    resolve: {
                      data: motorLeadsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/motors-lead/components/view-motors-lead/view-motors-lead.component'
                      ).then((c) => c.ViewMotorsLeadComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-medical-lead/:id',
                    resolve: {
                      medicalLead: medicalLeadsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/medical-leads/components/view-medical-leads/view-medical-leads.component'
                      ).then((c) => c.ViewMedicalLeadsComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-building-lead/:id',
                    resolve: {
                      data: buildingLeadsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/building-lead/components/view-building-lead/view-building-lead.component'
                      ).then((c) => c.ViewBuildingLeadComponent),
                    title: 'Capital ',
                  },
                  {
                    path: 'view-jop-lead/:id',
                    resolve: {
                      data: jopLeadsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './jop-insurance/view-jop-lead/view-jop-lead.component'
                      ).then((c) => c.ViewJopLeadComponent),
                    title: 'Capital ',
                  },
                ],
              },

              // ===============================================
              // USER MANAGEMENT
              // ===============================================
              {
                path: 'all-users',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/users/all-users/all-users.component'
                  ).then((c) => c.AllUsersComponent),
                title: 'Capital ',
              },

              // --- ADD USER ---
              {
                path: 'add-user',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/users/add-user/add-user.component'
                  ).then((c) => c.AddUserComponent),
                title: 'Capital ',
              },

              // --- VIEW USER ---
              {
                path: 'view-user/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/users/view-user/view-user.component'
                  ).then((c) => c.UserDetailComponent),
                title: 'Capital ',
                resolve: {
                  data: UserResolver,
                },
              },
              // ===============================================
              // Employee MANAGEMENT
              // ===============================================
              {
                path: 'all-employees',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/employees/all-employees/all-employee.component'
                  ).then((c) => c.AllEmployeesComponent),
                title: 'Capital ',
              },

              // --- ADD USER ---
              {
                path: 'add-employee',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/employees/add-employee/add-employee.component'
                  ).then((c) => c.AddEmployeeComponent),
                title: 'Capital ',
              },

              // --- VIEW USER ---
              {
                path: 'view-employee/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/employees/view-employee/view-employee.component'
                  ).then((c) => c.EmployeeDetailComponent),
                title: 'Capital ',
                resolve: {
                  data: UserResolver,
                },
              },
              // --- DOWNLOAD INFORMATION ---
              {
                path: 'download-info',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/download/download-info/download-info.component'
                  ).then((c) => c.DownloadInfoComponent),
                title: 'Capital ',
              },
              // END OF MENU CHILDREN
            ],
          },
        ],
      },
      // ===============================================
      // UTILITY ROUTES
      // ===============================================
      {
        path: 'internet-error',
        component: JInternetConnectionComponent,
        title: 'Internet Connection Error',
      },
    ],
  },
  // ===============================================
  // FALLBACK ROUTES
  // ===============================================
  {
    path: '**',
    loadComponent: () =>
      import('./pages/main/not-found/not-found.component').then(
        (e) => e.NotFoundComponent
      ),
    title: 'Page Not Found',
  },
];
