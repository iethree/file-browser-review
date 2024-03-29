import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import type { Folder } from '@types';

import { Menu } from 'react-daisyui';

import { FolderNavPath } from './FolderNavPath';

import {
  getFolderStackFromPath,
  getPathFromFolderStack,
  isPathFromStack,
} from './utils';

import { FolderOrFileComponent } from '@/components/FileBrowser/FileDisplay';

export const FileBrowser = ({ rootFolder }: { rootFolder?: Folder }) => {
  const [folderStack, setFolderStack] = useState<Folder[]>(
    rootFolder ? [rootFolder] : []
  );

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

  const currentFolder: Folder | undefined =
    folderStack?.[folderStack.length - 1];

  return (
    <>
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
            <FolderNavPath
              folders={folderStack}
              onFolderSelect={handleUpdateFolderStack}
            />

            <Menu data-testid='file-browser-list'>
              {currentFolder.files.map((item) => (
                <FolderOrFileComponent
                  key={item.id}
                  item={item}
                  onFolderSelect={(f) => handleUpdateFolderStack(f as Folder)}
                />
              ))}
            </Menu>
          </>
        )}
      </div>
    </>
  );
};
