import { createBrowserRouter, Navigate } from "react-router-dom";
import { Profile } from "../features/auth";
import { NotFound } from "../pages/NotFound/NotFound";
import { PublicRoute } from "../routes/PublicRoute";
import { EmployeeRoute } from "../routes/EmployeeRoute";
import { DoctorRoute } from "../routes/DoctorRoute";
import { PatientPage } from "../pages/Patient";
import { AppointmentPage } from "../pages/Appointment";
import { MedicalRecordDetail } from '../pages/MedicalRecord/MedicalRecordDetail';
import { MedicalRecordPage } from "../pages/MedicalRecord";
import { ChangePasswordPage } from "../pages/RecoveryPassword";
import HomePage from "../pages/Home";
import { LoginPage } from "../pages/Login";
import { MainLayout } from "../layouts";
import { AdminRoute } from "./AdminRoute";
import { EmployeePage } from "../pages/Employee";
import { DoctorPage } from "../pages/Doctor";
import { CategoryPage } from "../pages/Category";
import { PatientHistory } from "../pages/Patient/PatientHistory";
import { MedicinePage } from "../pages/Medicine";
import { RoomPage } from "../pages/Room";
import { ServicePage } from "../pages/Service";

const routes = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: <HomePage />
      }
    ],
  },

  {
    path: "/employee",
    element: <EmployeeRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={"patients"} replace />,
          },
          {
            path: "patients",
            element: <PatientPage />,
          },
          {
            path: "patients/:patientId",
            element: <PatientHistory />,
          },
          {
            path: "appointments",
            element: <AppointmentPage />
          },
          {
            path: "medical-records",
            element: <MedicalRecordPage />
          },
          {
            path: "medical-records/:record_id",
            element: <MedicalRecordDetail />
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />
          },
        ],
      },
    ],
  },

  {
    path: "/doctor",
    element: <DoctorRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={"appointments"} replace />
          },
          {
            path: "appointments",
            element: <AppointmentPage />
          },
          {
            path: "medical-records",
            element: <MedicalRecordPage />
          },
          {
            path: "medical-records/:record_id",
            element: <MedicalRecordDetail />
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />
          },
        ]
      }
    ]
  },


  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={"users/patients"} replace />
          },
          {
            path: "users",
            children: [
              {
                path: "patients",
                element: <PatientPage />
              },
              {
                path: "doctors",
                element: <DoctorPage />
              },
              {
                path: "employees",
                element: <EmployeePage />
              }
            ]
          },
          {
            path: "rooms",
            element: <RoomPage />
          },
          {
            path: "services",
            element: <ServicePage />
          },
          {
            path: "categories",
            element: <CategoryPage />
          },
          {
            path: "medicines",
            element: <MedicinePage />
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />
          }
        ]
      },
    ]
  },

  // Not found
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
