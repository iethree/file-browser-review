import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import type { Folder } from '@types';
import type { FileSearchItem } from './types';

import { Menu } from 'react-daisyui';

import { FolderNavPath } from './FolderNavPath';

import {
  getFolderStackFromPath,
  getPathFromFolderStack,
  isPathFromStack,
  buildSearchMap,
  searchFiles,
} from './utils';

import { FileSearchResults } from './FileSearchResults';
import { FolderOrFileComponent } from '@/components/FileBrowser/FileDisplay';
import { SearchInput } from '@/components/SearchInput';

export const FileBrowser = ({ rootFolder }: { rootFolder?: Folder }) => {
  const [, setSearchParams] = useSearchParams();

  const [folderStack, setFolderStack] = useState<Folder[]>(
    rootFolder ? [rootFolder] : []
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchHits, setSearchHits] = useState<FileSearchItem[] | null>([]);

  const pathParams = useParams();
  const navigate = useNavigate();
  const pathStack = useMemo(
    () => pathParams['*']?.split('/') ?? [],
    [pathParams]
  );

  useEffect(() => {
    if (rootFolder && !folderStack.length) {
      setFolderStack([rootFolder]);
    }
  }, [rootFolder]);

  useEffect(() => {
    if (pathStack.length && rootFolder) {
      // if the folder stack doesn't match the url path, update it
      const shouldUpdateStack = !isPathFromStack(pathStack, folderStack);
      if (shouldUpdateStack) {
        setFolderStack(getFolderStackFromPath(pathStack, rootFolder));
      }
    }
  }, [pathStack, rootFolder]);

  const handleUpdateFolderStack = (newFolder: Folder[] | Folder) => {
    // if the argument is a single folder, add it to the stack
    const newStack = Array.isArray(newFolder)
      ? newFolder
      : [...folderStack, newFolder];

    setFolderStack(newStack);
    navigate(getPathFromFolderStack(newStack));
  };

  const searchMap = rootFolder && buildSearchMap(rootFolder);

  const handleSearchQueryChange = useCallback(
    (newQuery: string) => {
      setSearchQuery(newQuery);
      if (newQuery.length < 2) {
        setSearchHits(null);
        setSearchParams({}, { replace: true });
        return;
      }
      if (searchMap) {
        const hits = searchFiles(searchMap, newQuery);
        setSearchHits(hits);
        setSearchParams({ q: newQuery }, { replace: true });
      }
    },
    [searchMap]
  );

  const handleSearchClick = (clicked: FileSearchItem) => {
    const path = clicked.path.split('/');
    if (rootFolder) {
      const newStack = getFolderStackFromPath(path, rootFolder);
      setFolderStack(newStack);
    }
    navigate('/files' + clicked.path);
    setSearchQuery('');
  };

  const currentFolder: Folder | undefined =
    folderStack?.[folderStack.length - 1];

  const showSearchHits = searchQuery.length > 1 && searchHits;
  const showFolderList = !showSearchHits;
  const showFolderNav = !showSearchHits;

  return (
    <>
      <SearchInput
        className='mb-2'
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <div
        className='rounded bg-base-200 relative h-full flex flex-col overflow-y-auto w-full overflow-x-hidden'
        data-testid='file-browser'
      >
        {!rootFolder && <div>Loading...</div>}

        {currentFolder && !currentFolder.files.length && (
          <div>No Files Found</div>
        )}

        {!!currentFolder?.files?.length && (
          <>
            {showSearchHits && (
              <FileSearchResults
                results={searchHits}
                onClick={handleSearchClick}
              />
            )}
            {showFolderNav && (
              <FolderNavPath
                folders={folderStack}
                onFolderSelect={handleUpdateFolderStack}
              />
            )}

            {showFolderList && (
              <Menu data-testid='file-browser-list'>
                {currentFolder.files.map((item) => (
                  <FolderOrFileComponent
                    key={item.id}
                    item={item}
                    onFolderSelect={(f) =>
                      handleUpdateFolderStack(f as Folder[])
                    }
                  />
                ))}
              </Menu>
            )}
          </>
        )}
      </div>
    </>
  );
};
