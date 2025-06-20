import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HeroSection } from "./features/home/components/HeroSection";
import { FeaturesSection } from "./features/home/components/FeaturesSection";
import { CategoriesSection } from "./features/home/components/CategoriesSection";
import AccountSettingsPage from "./features/profile/components/AccountSettingsPage";
import DashboardPage from "./features/dashboard/components/DashboardPage"; // Added DashboardPage import
import PasswordResetPage from "./features/auth/components/PasswordResetPage"; // Added PasswordResetPage import
import { ProfilePage } from "./features/profile/components/ProfilePage"; // Added ProfilePage import
import UserManagement from "./features/admin/components/management/UserManagement"; // Import UserManagement component
import ManagerManagement from "./features/admin/components/management/ManagerManagement"; // Import ManagerManagement component
import PlayerManagement from "./features/admin/components/management/PlayerManagement"; // Import PlayerManagement component
import CompanyManagement from "./features/admin/components/company/CompanyManagement"; // Import CompanyManagement component
import AdminSignInPage from "./features/admin/components/AdminSignInPage"; // Import AdminSignInPage component
import { Navbar } from "./core/layout/Navbar"; // Ensured Navbar is imported if used globally
import { Footer } from "./core/layout/Footer"; // Ensured Footer is imported if used globally
import './App.css'; // Import App.css for global styles and animations

// A simple HomePage component for the main route
const HomePage = () => (
  <>
    <HeroSection />
    <CategoriesSection />
    <FeaturesSection />
  </>
);

function App() {
  return (
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          {/* Render Navbar and Footer conditionally or let pages handle them */}
          <Routes>
          <Route path="/" element={<>
            <Navbar />
            <main className="flex-grow">
              <HomePage />
            </main>
            <Footer />
          </>} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password/:token" element={<PasswordResetPage />} />
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path="user-management" element={<UserManagement />} />
            <Route path="manager-management" element={<ManagerManagement />} /> {/* Added ManagerManagement route */}
            <Route path="player-management" element={<PlayerManagement />} /> {/* Added PlayerManagement route */}
            <Route path="company-management" element={<CompanyManagement />} /> {/* Added CompanyManagement route */}
          </Route> {/* Added Dashboard route with nested UserManagement route */}
          <Route path="/sportify-admin" element={<AdminSignInPage />} />
          {/* Add other routes here */}          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
