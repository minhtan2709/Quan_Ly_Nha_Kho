"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  imageUrl?: string; // <-- thêm
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void; // parent sẽ POST lên BE
};

const CreateProductModal = ({ isOpen, onClose, onCreate }: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    productId: v4(),      // giữ lại nếu BE cho phép tự truyền; nếu BE tự tạo UUID thì không dùng
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
    imageUrl: "",         // <-- thêm
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // chỉ gửi các field FE cần/BE nhận
    const payload: ProductFormData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      rating: Number(formData.rating),
      imageUrl: formData.imageUrl?.trim() || undefined,
    };
    onCreate(payload);
    onClose();
  };

  if (!isOpen) return null;

  const labelCss = "block text-sm font-medium text-gray-700";
  const inputCss =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md focus:outline-none focus:border-blue-500";

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="name" className={labelCss}>Product Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCss}
            required
          />

          {/* PRICE */}
          <label htmlFor="price" className={labelCss}>Price</label>
          <input
            id="price"
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCss}
            min={0}
            step="0.01"
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCss}>Stock Quantity</label>
          <input
            id="stockQuantity"
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCss}
            min={0}
            required
          />

          {/* RATING */}
          <label htmlFor="rating" className={labelCss}>Rating</label>
          <input
            id="rating"
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className={inputCss}
            min={0}
            max={5}
            step="0.1"
            required
          />

          {/* IMAGE URL (Cloudinary) */}
          <label htmlFor="imageUrl" className={labelCss}>Image URL (Cloudinary)</label>
          <input
            id="imageUrl"
            type="url"
            name="imageUrl"
            placeholder="https://res.cloudinary.com/..."
            onChange={handleChange}
            value={formData.imageUrl}
            className={inputCss}
            // không required: nếu bỏ trống sẽ dùng placeholder ở FE
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
