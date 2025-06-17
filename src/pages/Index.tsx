
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CompanySettings from "@/components/CompanySettings";
import ProductsManagement from "@/components/ProductsManagement";
import QuoteGenerator from "@/components/QuoteGenerator";

const Index = () => {
  const [activeTab, setActiveTab] = useState("quotes");

  const renderContent = () => {
    switch (activeTab) {
      case "company":
        return <CompanySettings />;
      case "products":
        return <ProductsManagement />;
      case "quotes":
      default:
        return <QuoteGenerator />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
