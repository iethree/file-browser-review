import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from 'react-daisyui';

interface SearchInputProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  'data-testid'?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search',
  'data-testid': testId = 'search-input',
  className = '',
}: SearchInputProps) => (
  <div className={`relative ${className}`}>
    <MagnifyingGlassIcon className='w-5 text-primary absolute mt-1.5 ml-2' />
    <Input
      data-testid={testId}
      size='sm'
      className='w-full pl-9'
      placeholder={placeholder}
      type='search'
      value={value}
      onChange={(e) => onChange(e.target.value ?? '')}
    />
  </div>
);
