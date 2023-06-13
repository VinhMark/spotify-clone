'use client';

import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { postData } from '@/libs/helpers';
import { toast } from 'react-hot-toast';
import Button from '@/components/Button';

const AccountContent = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const subscribeModal = useSubscribeModal();
  const { isLoading, subscription, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
      });
      window.location.assign(url);
    } catch (error) {
      toast.error((error as Error)?.message);
    }
    setLoading(false);
  };

  console.log(subscription);
  return (
    <div className='mb-7 px-6'>
      {!subscription && (
        <div className='flex flex-col gap-y-4'>
          <p>No active plan.</p>
          <Button onClick={subscribeModal.onOpen} className='w-[300px]'>
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className='flex flex-col gap-y-4'>
          <p>
            You are currently on the{' '}
            <b>
              {
                // @ts-ignore
                subscription?.prices?.products?.name
              }
            </b>{' '}
            plan.
          </p>
          <Button disabled={loading || isLoading} onClick={redirectToCustomerPortal} className='w-[300px]'>
            Open Custom Portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
