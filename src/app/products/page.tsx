"use client";

import { Separator } from "@/components/ui/separator";
import { Product } from "@/model/Product";
import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ghost } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-all-products");
        if (Array.isArray(response.data.feedback)) {
          setProducts(response.data.feedback);
          setFilteredProducts(response.data.feedback);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        if (refresh) {
          toast({
            title: "Refreshed feedbacks",
            description: "Showing latest feedbacks",
          });
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setProducts, setFilteredProducts]
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSaveProduct = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/add-product", {
        productname: newProductName,
        category: newProductCategory,
      });
      toast({
        title: "Success",
        description: response.data.feedback,
      });
      //   if (response.data.success) {
      //     // Refetch products after adding
      //     setProducts((prev) => [
      //       ...prev,
      //       { productname: newProductName, feedbacks: [] } as Product,
      //     ]);
      //     setFilteredProducts((prev) => [
      //       ...prev,
      //       { productname: newProductName, feedbacks: [] } as Product,
      //     ]);
      //     setNewProductName("");
      //     setNewProductCategory("");
      //   } else {
      //     console.error(response.data.feedback || "Failed to add product");
      //   }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-6">Products</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for a product..."
        className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <Link
              key={index}
              href={`/products/${encodeURIComponent(product.productname)}`} // <--- important for spaces/special characters
              className="p-4 border rounded-md shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold">{product.productname}</h2>
            </Link>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <Separator />
      <div className="mt-6">
        <p>
          Don't find the product you are looking for?{" "}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Add now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a product</DialogTitle>
                <DialogDescription>
                  Type the name of the product you want to add and press save to
                  add it.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. MacBook Air"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Laptop"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSaveProduct}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </p>
      </div>
    </div>
  );
};

export default ProductsPage;
