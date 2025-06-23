
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import CompanySettings from "@/components/CompanySettings";
import ProductsManagement from "@/components/ProductsManagement";
import ClientManagement from "@/components/ClientManagement";
import InvoiceHistory from "@/components/InvoiceHistory";
import QuoteGenerator from "@/components/QuoteGenerator";
import LoginPage from "@/components/LoginPage";
import FirstTimeSetup from "@/components/FirstTimeSetup";

const Index = () => {
  const [activeTab, setActiveTab] = useState("quotes");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTimeSetupComplete, setIsFirstTimeSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and setup status
    const authStatus = localStorage.getItem("isAuthenticated");
    const setupStatus = localStorage.getItem("isFirstTimeSetupComplete");
    
    setIsAuthenticated(authStatus === "true");
    setIsFirstTimeSetupComplete(setupStatus === "true");
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Simple demo authentication - in real app, this would call an API
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    setIsAuthenticated(true);
  };

  const handleFirstTimeSetupComplete = () => {
    setIsFirstTimeSetupComplete(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setActiveTab("quotes");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "company":
        return <CompanySettings />;
      case "products":
        return <ProductsManagement />;
      case "clients":
        return <ClientManagement />;
      case "history":
        return <InvoiceHistory />;
      case "quotes":
      default:
        return <QuoteGenerator />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "company": return "Company Settings";
      case "products": return "Products Management";
      case "clients": return "Client Management";
      case "history": return "Invoice History";
      case "quotes": 
      default: return "Quote Generator";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (!isFirstTimeSetupComplete) {
    return <FirstTimeSetup onComplete={handleFirstTimeSetupComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto">
        <div className="lg:hidden">
          {/* Mobile header for better responsive experience */}
          <div className="bg-white border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h2>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
