
import { FileText, Settings, Package, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: "quotes", label: "Quotes", icon: FileText },
    { id: "products", label: "Products", icon: Package },
    { id: "company", label: "Company Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">QuoteGen Pro</h1>
        <p className="text-sm text-gray-600">Professional Quotation System</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                activeTab === item.id && "bg-blue-600 text-white hover:bg-blue-700"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={20} />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="mt-8 pt-8 border-t border-gray-200">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => onTabChange("quotes")}
        >
          <Plus size={20} className="mr-2" />
          New Quote
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
