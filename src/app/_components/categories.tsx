"use client"
import { api } from "~/trpc/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema, updateCategorySchema } from "~/types/payloads/categories";
import { useState, useEffect } from "react";

export default function CategoryComponent() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    setValue: setUpdateValue,
  } = useForm<z.infer<typeof updateCategorySchema>>({
    resolver: zodResolver(updateCategorySchema),
  });

  const createCategory = api.category.createCategory.useMutation();
  const updateCategory = api.category.updateCategory.useMutation();
  const deleteCategory = api.category.deleteCategory.useMutation();
  const categoriesQuery = api.category.getAllCategories.useQuery();

  const selectedCategoryQuery = api.category.getCategoryById.useQuery(selectedCategoryId ?? -1, {
    enabled: !!selectedCategoryId,
  });

  useEffect(() => {
    if (selectedCategoryQuery.data) {
      const data = selectedCategoryQuery.data;
      setUpdateValue("id", data.id);
      setUpdateValue("name", data.name);
      setUpdateValue("description", data.description || '');
    }
  }, [selectedCategoryQuery.data, setUpdateValue]);

  const onSubmitCategory = async (data: z.infer<typeof createCategorySchema>) => {
    await createCategory.mutateAsync(data);
    reset();
    categoriesQuery.refetch();
  };

  const onUpdateCategory = async (data: z.infer<typeof updateCategorySchema>) => {
    await updateCategory.mutateAsync(data);
    resetUpdate();
    categoriesQuery.refetch();
  };

  const onDeleteCategory = async (id: number) => {
    await deleteCategory.mutateAsync(id);
    categoriesQuery.refetch();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitCategory)}>
        <h2 className="text-xl font-semibold">Create Category</h2>
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
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Create Category
        </button>
      </form>

      <form onSubmit={handleSubmitUpdate(onUpdateCategory)} className="mt-8">
        <h2 className="text-xl font-semibold">Update Category</h2>
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Category
          </label>
          <select
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
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
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Update Category
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Delete Category</h2>
        <div className="my-4">
          {categoriesQuery.data?.map((category) => (
            <div key={category.id} className="my-2 flex items-center justify-between">
              <span>{category.name}</span>
              <button
                onClick={() => onDeleteCategory(category.id)}
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
