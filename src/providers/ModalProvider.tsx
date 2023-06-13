'use client';

import AuthModal from '@/components/AuthModal';
import SubscribeModal from '@/components/SubscribeModal';
import UploadModal from '@/components/UploadModal';
import { useEffect, useState } from 'react';
import { ProductsWithPrices } from '../../types';

interface ModalProviderProps {
  products: ProductsWithPrices[];
}

const ModalProvider = ({ products }: ModalProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;
