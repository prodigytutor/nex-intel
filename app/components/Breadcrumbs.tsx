import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? 'text-gray-900 font-medium' : 'text-gray-500'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}