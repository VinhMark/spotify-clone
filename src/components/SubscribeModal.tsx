'use client';

import { useState } from 'react';
import { Price, ProductsWithPrices } from '../../types';
import Button from './Button';
import Modal from './Modal';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import { postData } from '@/libs/helpers';
import { getStripe } from '@/libs/stripeClient';
import useSubscribeModal from '@/hooks/useSubscribeModal';

interface SubscribeModalProps {
  products: ProductsWithPrices[];
}

const SubscribeModal = ({ products }: SubscribeModalProps) => {
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading, subscription } = useUser();
  const subscribeModal = useSubscribeModal();

  let content = <div className=''>No product available.</div>;

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Must be logged in.');
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast.error('Already subscribe.');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  const formatPrice = (price: Price) => {
    const priceString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
    }).format((price?.unit_amount || 0) / 100);

    return priceString;
  };

  if (products.length > 0) {
    content = (
      <div className=''>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No price available.</div>;
          }
          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className='mb-4'
            >{`Subscribe for ${formatPrice(price)} a ${price.interval}`}</Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className='text-center'>Already Subscribed</div>;
  }

  return (
    <Modal
      title='Only for premium users'
      description='Listen to music with Spotify Premium'
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
