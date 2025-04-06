
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SaveButton from '@/components/SaveButton';

interface ItemCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  date: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ id, title, price, image, location, date }) => {
  return (
    <Link to={`/item/${id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md group">
        <div className="relative w-full pt-[75%]">
          <img 
            src={image}
            alt={title}
            className="absolute inset-0 object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <SaveButton itemId={id} />
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-base line-clamp-1">{title}</h3>
          <p className="text-lg font-bold text-marketplace-purple">${price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="px-3 py-2 pt-0 flex justify-between text-xs text-gray-500">
          <span>{location}</span>
          <span>{date}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ItemCard;
