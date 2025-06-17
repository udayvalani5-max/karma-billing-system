
import { FileText, Settings, Package, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activeTab, onTabChange, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: "quotes", label: "Quotes", icon: FileText },
    { id: "products", label: "Products", icon: Package },
    { id: "company", label: "Company Settings", icon: Settings },
  ];

  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  return (
    <div className="w-16 lg:w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="hidden lg:block">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">QuoteGen Pro</h1>
          <p className="text-xs lg:text-sm text-gray-600">Professional Quotation System</p>
        </div>
        <div className="lg:hidden flex items-center justify-center">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-2 lg:p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-center lg:justify-start gap-0 lg:gap-3 p-2 lg:p-3",
                activeTab === item.id && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={20} />
              <span className="hidden lg:inline">{item.label}</span>
            </Button>
          );
        })}
      </nav>
      
      {/* New Quote Button */}
      <div className="p-2 lg:p-4 border-t border-gray-200">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 justify-center lg:justify-start gap-0 lg:gap-2 p-2 lg:p-3"
          onClick={() => onTabChange("quotes")}
        >
          <Plus size={20} />
          <span className="hidden lg:inline">New Quote</span>
        </Button>
      </div>

      {/* User Section */}
      <div className="p-2 lg:p-4 border-t border-gray-200 space-y-2">
        <div className="hidden lg:block">
          <p className="text-sm text-gray-600 truncate">{userEmail}</p>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-center lg:justify-start gap-0 lg:gap-2 p-2 lg:p-3 text-red-600 border-red-200 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut size={20} />
          <span className="hidden lg:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
