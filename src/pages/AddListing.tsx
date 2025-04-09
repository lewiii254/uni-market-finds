
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ListingForm from '@/components/ListingForm';

const AddListing = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <div className="py-4">
        <ListingForm />
      </div>
    </PageLayout>
  );
};

export default AddListing;
