"use client";
import { api } from "~/trpc/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  updateProductSchema,
} from "~/types/payloads/product";
import { useState, useEffect } from "react";
import { Product } from "~/types";

export default function ProductComponent() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      categoryId: 0,
    },
  });

  useEffect(() => {
    register("price");
    register("categoryId");
  }, [register]);

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    setValue: setUpdateValue,
    reset: resetUpdate,
  } = useForm<Product>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      categoryId: 0,
    },
  });

  const createProduct = api.product.createProduct.useMutation();
  const updateProduct = api.product.updateProduct.useMutation();
  const deleteProduct = api.product.deleteProduct.useMutation();
  const productsQuery = api.product.getAllProducts.useQuery();
  const categoriesQuery = api.category.getAllCategories.useQuery();
  const selectedProductQuery = api.product.getProductById.useQuery(
    selectedProductId ?? -1,
    {
      enabled: !!selectedProductId,
    },
  );

  useEffect(() => {
    if (selectedProductQuery.data) {
      const { id, name, description, price, categoryId } = selectedProductQuery.data;
      setUpdateValue("id", id);
      setUpdateValue("name", name);
      setUpdateValue("description", description || "");
      setUpdateValue("price", price);
      setUpdateValue("categoryId", categoryId);
    }
  }, [selectedProductQuery.data, setUpdateValue]);

  const handleCreatePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue("price", event.target.value === "" ? 0 : Number(event.target.value));
  };
  
  const handleUpdatePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateValue("price", event.target.value === "" ? 0 : Number(event.target.value));
  };
  
  const handleCreateCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("categoryId", event.target.value === "" ? 0 : parseInt(event.target.value, 10));
  };

  const handleUpdateCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdateValue("categoryId", event.target.value === "" ? 0 : parseInt(event.target.value, 10));
  };

  const onSubmitProduct = async (data: Product) => {
    const preparedData = {
      ...data,
      price: Number(data.price),
      categoryId: Number(data.categoryId),
    };
    console.log("Submitting data:", preparedData);
    await createProduct.mutateAsync(preparedData);
    reset();
    productsQuery.refetch();
  };

  const onUpdateProduct = async (data: Product) => {
    const preparedData = {
      ...data,
      price: Number(data.price),
      categoryId: Number(data.categoryId),
    };
    console.log("Updating data:", preparedData);
    await updateProduct.mutateAsync(preparedData);
    resetUpdate();
    productsQuery.refetch();
  };

  const onDeleteProduct = async (id: number) => {
    await deleteProduct.mutateAsync(id);
    productsQuery.refetch();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitProduct)} className="mt-8">
        <h2 className="text-xl font-semibold">Create Product</h2>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            onChange={handleCreatePriceChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            onChange={handleCreateCategoryChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categoriesQuery.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Create Product
        </button>
      </form>

      <form onSubmit={handleSubmitUpdate(onUpdateProduct)} className="mt-8">
        <h2 className="text-xl font-semibold">Update Product</h2>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Product
          </label>
          <select
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          >
            <option value="">Select a product</option>
            {productsQuery.data?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...registerUpdate("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...registerUpdate("description")}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            onChange={(e) => {
              setUpdateValue("price", e.target.value === "" ? 0 : Number(e.target.value));
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          />
        </div>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            onChange={(e) => {
              setUpdateValue("categoryId", e.target.value === "" ? 0 : parseInt(e.target.value, 10));
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categoriesQuery.data?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Update Product
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Delete Product</h2>
        <div className="my-4">
          {productsQuery.data?.map((product) => (
            <div
              key={product.id}
              className="my-2 flex items-center justify-between"
            >
              <span>{product.name}</span>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="rounded bg-red-600 px-3 py-1 text-white"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
