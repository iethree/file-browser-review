import type { Folder, FileItem } from '@types';

export type FileSearchItem = Omit<FileItem, 'files'> & {
  path: string;
};

export type FolderSelectAction = (
  newFolder: Folder[] | Folder | FileSearchItem
) => void;

export const isFileSearchItem = (
  item: FileSearchItem | FileItem
): item is FileSearchItem => {
  return !!(item as FileSearchItem)?.path;
};
