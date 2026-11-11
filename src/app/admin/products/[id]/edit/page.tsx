'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '../../../../../components/ProductForm';
import { StoreService } from '../../../../../lib/storeService';
import { Product } from '../../../../../lib/types';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      StoreService.getProductById(id).then((res) => {
        setProduct(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-brand-dark/60 space-y-2">
        <div className="w-8 h-8 mx-auto border-3 border-brand-burgundy border-t-transparent rounded-full animate-spin" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-16 text-center text-xs text-brand-dark">
        <p className="font-serif text-lg font-bold">Product not found</p>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEdit={true} />;
}
