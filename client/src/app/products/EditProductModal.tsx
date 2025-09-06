"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Header from "@/app/(components)/Header";

export type EditProduct = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number | null;
  imageUrl?: string | null;
};

type EditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: EditProduct | null;
  onUpdate: (
    id: string,
    data: {
      name?: string;
      price?: number;
      stockQuantity?: number;
      rating?: number | null;
      imageUrl?: string | null;
    }
  ) => void;
};

const EditProductModal = ({ isOpen, onClose, product, onUpdate }: EditProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
    imageUrl: "",
  });

  useEffect(() => {
    if (!product) return;
    setFormData({
      name: product.name || "",
      price: Number(product.price || 0),
      stockQuantity: Number(product.stockQuantity || 0),
      rating: Number(product.rating ?? 0),
      imageUrl: String(product.imageUrl || ""),
    });
  }, [product]);

  if (!isOpen || !product) return null;

  const labelCss = "block text-sm font-medium text-gray-700";
  const inputCss =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md focus:outline-none focus:border-blue-500";

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
    onUpdate(product.productId, {
      name: formData.name.trim(),
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      rating: Number(formData.rating),
      imageUrl: formData.imageUrl.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Edit Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* NAME */}
          <label htmlFor="name" className={labelCss}>Product Name</label>
          <input
            id="name" name="name" type="text" className={inputCss}
            value={formData.name} onChange={handleChange} required
          />

          {/* PRICE */}
          <label htmlFor="price" className={labelCss}>Price</label>
          <input
            id="price" name="price" type="number" className={inputCss}
            value={formData.price} onChange={handleChange} min={0} step="0.01" required
          />

          {/* STOCK */}
          <label htmlFor="stockQuantity" className={labelCss}>Stock Quantity</label>
          <input
            id="stockQuantity" name="stockQuantity" type="number" className={inputCss}
            value={formData.stockQuantity} onChange={handleChange} min={0} required
          />

          {/* RATING */}
          <label htmlFor="rating" className={labelCss}>Rating</label>
          <input
            id="rating" name="rating" type="number" className={inputCss}
            value={formData.rating} onChange={handleChange} min={0} max={5} step="0.1" required
          />

          {/* IMAGE URL */}
          <label htmlFor="imageUrl" className={labelCss}>Image URL (Cloudinary)</label>
          <input
            id="imageUrl" name="imageUrl" type="url" className={inputCss}
            value={formData.imageUrl} onChange={handleChange} placeholder="https://res.cloudinary.com/..."
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
