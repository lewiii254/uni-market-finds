
import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BookIcon, LaptopIcon, ShirtIcon, HomeIcon, BriefcaseIcon, CoffeeIcon, ShoppingBagIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { name: "All Items", icon: ShoppingBagIcon, path: "/search?category=All%20Categories" },
  { name: "Electronics", icon: LaptopIcon, path: "/search?category=Electronics" },
  { name: "Textbooks", icon: BookIcon, path: "/search?category=Textbooks" },
  { name: "Furniture", icon: HomeIcon, path: "/search?category=Furniture" },
  { name: "Clothing", icon: ShirtIcon, path: "/search?category=Clothing" },
  { name: "School Supplies", icon: BriefcaseIcon, path: "/search?category=School%20Supplies" },
  { name: "Dorm Essentials", icon: CoffeeIcon, path: "/search?category=Dorm%20Essentials" },
];

const Categories = () => {
  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-3">Browse Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 p-1">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={category.path}
                  className="flex flex-col items-center justify-center w-20 h-20 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-marketplace-purple hover:scale-105 transition-all duration-200"
                >
                  <Icon className="w-6 h-6 text-marketplace-purple mb-1" />
                  <span className="text-xs text-center line-clamp-1">{category.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Categories;
