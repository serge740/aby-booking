import React, { Suspense, lazy } from "react";
import { BrowserRouter, createBrowserRouter, Navigate, Outlet, Route, RouterProvider, Routes } from "react-router-dom"
const HomePage = lazy(() => import("./pages/HomePage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const BlogPage = lazy(() => import("./pages/blogs/BlogPage"));
const BlogSingle = lazy(() => import("./pages/blogs/Blogsingle"));
const ServicePage = lazy(() => import("./pages/services/ServicePage"));
const ServiceSingle = lazy(() => import("./pages/services/ServiceSingle"));
const BlogContainer = lazy(() => import("../src/pages/blogs/blogContainer"));
const AboutUs = lazy(() => import('./pages/about us/aboutUs'));
const TeamMember = lazy(() => import('./pages/Team'))
const MenuPage = lazy(() => import('./pages/MenuPage'));

import MainLayout from "./layouts/MainLayout";
import ProjectsPage from "./pages/Projects/ProjectPages";
import AdminLogin from "./pages/auth/admin/Login";
import ProtectPrivateAdminRoute from "./components/protectors/ProtectPrivateAdminRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import AdminProfilePage from "./pages/dashboard/admin/AdminProfile";
import UnlockScreen from "./pages/auth/admin/UnlockScreen";
import CompanyDashboard from "./pages/dashboard/CompanyDashboard";
import ReportDashboard from "./pages/dashboard/ReportManagement";
import CommingSoon from "./layouts/CommingSoon";
import CoffeeShopPage from "./pages/product/Product";
import CoffeeShop from "./pages/product/SingleProduct";
import CartPage from "./pages/CartPage";
import Gallery from "./components/home/Gallery";
import ReviewsTimeLine from "./pages/Reviews";
import CompanyFormPage from "./components/dashboard/company/CompanyFormPage";
import CompanyViewPage from "./components/dashboard/company/CompanyViewPage";
import CompanyLoginPage from "./pages/auth/company/Login";
import ProtectPrivateCompanyRoute from "./components/protectors/ProtectPrivateCompanyRoute";
import CompanyProfilePage from "./pages/dashboard/company/CompanyProfilePage";
import MenuCategoryDashboard from "./pages/dashboard/company/MenuCategoryDashboard";


// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const SuspenseWrapper = ({ children }) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
}

const router = createBrowserRouter([

{
  path: '/',
  element: <MainLayout />,
  children: [
    { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
    { path: 'blogs', element: <SuspenseWrapper><BlogPage /></SuspenseWrapper> },
    { path: 'blog/:id', element: <SuspenseWrapper><BlogSingle /></SuspenseWrapper> },
    { path: 'contact-us', element: <SuspenseWrapper><ContactUs /></SuspenseWrapper> },
    { path: 'services', element: <SuspenseWrapper><ServicePage /></SuspenseWrapper> },
    { path: 'about-us', element: <SuspenseWrapper><AboutUs /></SuspenseWrapper> },
    { path: 'service/:id', element: <SuspenseWrapper><ServiceSingle /></SuspenseWrapper> },
    { path: 'project', element: <SuspenseWrapper><ProjectsPage /></SuspenseWrapper> },
    { path: 'team-member', element: <SuspenseWrapper><TeamMember /></SuspenseWrapper> },
    { path: 'reviews', element: <SuspenseWrapper><ReviewsTimeLine /></SuspenseWrapper> },
    { path: 'menu', element: <SuspenseWrapper><MenuPage /></SuspenseWrapper> },
    { path: 'products', element: <SuspenseWrapper><CoffeeShopPage /></SuspenseWrapper> },
    { path: 'products/:id', element: <SuspenseWrapper><CoffeeShop /></SuspenseWrapper> },
    { path: 'cart', element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
    { path: 'gallery', element: <SuspenseWrapper><Gallery /></SuspenseWrapper> },
 
  ]
},

  {
    path:'/admin',
    element: <ProtectPrivateAdminRoute><Outlet context={{role:'admin'}} /></ProtectPrivateAdminRoute>,
    children:[
       { index: true, element: <Navigate to={'/admin/dashboard'}></Navigate>},
       { 
        path: 'dashboard', 
        element: <SuspenseWrapper><DashboardLayout /> </SuspenseWrapper>,
        children:[
          {index:true , element:<DashboardHome />},
          {path:'company' , element:<CompanyDashboard />},
          {path:'company/create' , element:<CompanyFormPage />},
          {path:'company/edit/:id' , element:<CompanyFormPage />},
          {path:'company/:id' , element:<CompanyViewPage />},
          {path:'profile' , element:<AdminProfilePage />},
          
        ]
       },

    ]
  },
  {
    path:'/company',
    element: <ProtectPrivateCompanyRoute><Outlet context={{role:'company'}} /></ProtectPrivateCompanyRoute>,
    children:[
       { index: true, element: <Navigate to={'/company/dashboard'}></Navigate>},
       { 
        path: 'dashboard', 
        element: <SuspenseWrapper><DashboardLayout /> </SuspenseWrapper>,
        children:[
          {index:true , element:<DashboardHome />},
 
          {path:'profile' , element:<CompanyProfilePage />},
          {path:'menu-category' , element:<MenuCategoryDashboard />},
          
        ]
       },

    ]
  },
  {
    path: '/auth/admin/login',
    element: (
      <SuspenseWrapper>
        <AdminLogin />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/company/login',
    element: (
      <SuspenseWrapper>
        <CompanyLoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/admin/unlock',
    element: (
      <SuspenseWrapper>
        <UnlockScreen />
      </SuspenseWrapper>
    ),
  },
])




function App() {



  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App