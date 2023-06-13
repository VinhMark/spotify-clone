import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProductsWithPrices } from '../../types';
import { cookies } from 'next/headers';

const getActiveProductsWithPrices = async (): Promise<ProductsWithPrices[]> => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error);
  }

  return (data as any) || [];
};

export default getActiveProductsWithPrices;
