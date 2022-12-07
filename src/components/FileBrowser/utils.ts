import type { Folder } from '@types';
import { slugify } from '@/utils/string';

import type { FileSearchItem } from './types';
import { MAX_SEARCH_RESULTS } from './constants';

// construct a stack of folders from slugified file names
export const getFolderStackFromPath = (
  pathStack: string[],
  rootFolder: Folder
): Folder[] => {
  const folderStack = [rootFolder];

  for (const folderName of pathStack) {
    if (!folderName) {
      return folderStack;
    }

    for (const fileItem of folderStack[folderStack.length - 1].files) {
      if (fileItem.type === 'folder' && slugify(fileItem.name) === folderName) {
        folderStack.push(fileItem as Folder);
        break;
      }
    }
  }

  return folderStack;
};

export const getPathFromFolderStack = (folderStack: Folder[]): string => {
  return folderStack.map((folder) => slugify(folder.name)).join('/');
};

export const isPathFromStack = (
  pathStack: string[],
  folderStack: Folder[]
): boolean => getPathFromFolderStack(folderStack) === pathStack.join('/');

export const buildSearchMap = (folder: Folder, path = '') => {
  const searchMap: FileSearchItem[] = [];

  for (const item of folder.files) {
    const searchItem = {
      ...item,
      path: item.type === 'folder' ? `${path}/${slugify(item.name)}` : path,
    };

    if (item.type === 'folder') {
      delete searchItem.files;
      searchMap.push(
        ...buildSearchMap(item as Folder, `${path}/${slugify(item.name)}`)
      );
    }

    searchMap.push(searchItem);
  }

  return searchMap;
};

export const searchFiles = (
  searchMap: FileSearchItem[],
  query: string,
  limit = MAX_SEARCH_RESULTS
): FileSearchItem[] => {
  const hits: FileSearchItem[] = [];

  for (const item of searchMap) {
    if (item.name.toLowerCase().includes(query.toLowerCase())) {
      hits.push(item);
    }

    if (limit && hits.length >= limit) {
      break;
    }
  }

  return hits;
};

export const clipLastFolder = (path: string) => {
  const pathStack = path.split('/');

  if (pathStack.length > 1) {
    pathStack.pop();
  }

  return pathStack.join('/');
};
