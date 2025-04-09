
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center space-y-4 text-white"
    >
      <div className="text-3xl mb-2">💰 🛒 💸</div>
      <h2 className="text-3xl font-bold">Ready to sell your items?</h2>
      <p className="text-white/90">Get started in minutes and reach thousands of students on campus</p>
      <Link to="/add-listing">
        <Button size="lg" className="bg-white text-marketplace-purple hover:bg-white/90 mt-2 font-medium">
          🚀 List Your Item Now
        </Button>
      </Link>
    </motion.div>
  );
};

export default CallToAction;
