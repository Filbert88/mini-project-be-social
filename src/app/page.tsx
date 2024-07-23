import CategoryComponent from "./_components/categories";
import ProductComponent from "./_components/products";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <div className="absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
        <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mx-auto max-w-md">
            <div className="divide-y divide-gray-200">
              <div className="space-y-4 py-8 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-center text-2xl font-bold">Simple CRUD</h1>
                <CategoryComponent />
                <ProductComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
