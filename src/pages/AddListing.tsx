
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ListingForm from '@/components/ListingForm';

const AddListing = () => {
  return (
    <PageLayout>
      <div className="py-4">
        <ListingForm />
      </div>
    </PageLayout>
  );
};

export default AddListing;
