
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  hsnSac: string;
  price: number;
  unit: string;
  igstRate: number;
}

const ProductsManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hsnSac: "",
    price: "",
    unit: "pcs",
    igstRate: "18",
  });

  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      const parsedProducts = JSON.parse(saved);
      // Handle backward compatibility
      const updatedProducts = parsedProducts.map((product: any) => ({
        ...product,
        hsnSac: product.hsnSac || "7607",
        igstRate: product.igstRate || 18
      }));
      setProducts(updatedProducts);
      if (JSON.stringify(updatedProducts) !== JSON.stringify(parsedProducts)) {
        localStorage.setItem("products", JSON.stringify(updatedProducts));
      }
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      id: isEditing || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      hsnSac: formData.hsnSac,
      price: parseFloat(formData.price),
      unit: formData.unit,
      igstRate: parseFloat(formData.igstRate),
    };

    if (isEditing) {
      const updated = products.map(p => p.id === isEditing ? product : p);
      saveProducts(updated);
      toast({ title: "Product updated successfully!" });
    } else {
      saveProducts([...products, product]);
      toast({ title: "Product added successfully!" });
    }

    setFormData({ name: "", description: "", hsnSac: "", price: "", unit: "pcs", igstRate: "18" });
    setIsEditing(null);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      hsnSac: product.hsnSac,
      price: product.price.toString(),
      unit: product.unit,
      igstRate: product.igstRate.toString(),
    });
    setIsEditing(product.id);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
    toast({ title: "Product deleted successfully!" });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Products Management</h2>
        <p className="text-gray-600">Manage your product catalog for quick quotation generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add/Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              {isEditing ? "Edit Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="hsnSac">HSN/SAC Code *</Label>
                <Input
                  id="hsnSac"
                  value={formData.hsnSac}
                  onChange={(e) => setFormData(prev => ({ ...prev, hsnSac: e.target.value }))}
                  placeholder="HSN/SAC Code"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="pcs, kg, hrs"
                  />
                </div>
                <div>
                  <Label htmlFor="igstRate">IGST Rate (%)</Label>
                  <Input
                    id="igstRate"
                    type="number"
                    step="0.01"
                    value={formData.igstRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, igstRate: e.target.value }))}
                    placeholder="18"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {isEditing ? "Update Product" : "Add Product"}
                </Button>
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(null);
                      setFormData({ name: "", description: "", hsnSac: "", price: "", unit: "pcs", igstRate: "18" });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products added yet</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        )}
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">HSN/SAC: {product.hsnSac}</p>
                          <p className="text-lg font-bold text-blue-600">
                            ₹{product.price.toFixed(2)} / {product.unit}
                          </p>
                          <p className="text-sm text-gray-600">IGST Rate: {product.igstRate}%</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsManagement;
