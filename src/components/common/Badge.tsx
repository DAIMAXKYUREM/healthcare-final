import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  status: string;
}

export const Badge = ({ status }: BadgeProps) => {
  const getStatusStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'emergency':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={clsx("px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border capitalize", getStatusStyles(status))}>
      {status}
    </span>
  );
};
