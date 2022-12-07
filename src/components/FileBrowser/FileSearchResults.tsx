import { Menu } from 'react-daisyui';
import { QueueListIcon } from '@heroicons/react/24/solid';

import type { FileSearchItem, FolderSelectAction } from './types';
import { FolderOrFileComponent } from './FileDisplay';
import { MAX_SEARCH_RESULTS } from './constants';

export const FileSearchResults = ({
  results,
  onClick,
}: {
  results: FileSearchItem[];
  onClick: (item: FileSearchItem) => void;
}) => {
  const resultsMessage =
    results.length >= MAX_SEARCH_RESULTS
      ? `${MAX_SEARCH_RESULTS}+ search results`
      : `${results.length} search results`;

  return (
    <>
      <div className='font-bold bg-base-100 p-2 flex item-center text-sm sticky top-0 z-20'>
        <QueueListIcon className='w-5 mr-2' />
        {resultsMessage}
      </div>
      {results.length ? (
        <>
          <Menu data-testid='file-search-results'>
            {results?.map((result) => (
              <FolderOrFileComponent
                key={result.id}
                item={result}
                onFolderSelect={onClick as FolderSelectAction}
              />
            ))}
          </Menu>
        </>
      ) : (
        <div className='p-5 text-center'>No Files Found</div>
      )}
    </>
  );
};
