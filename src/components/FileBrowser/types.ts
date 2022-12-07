import type { Folder, FileItem } from '@types';

export type FileSearchItem = Omit<FileItem, 'files'> & {
  path: string;
};

export type FolderSelectAction = (
  newFolder: Folder[] | Folder | FileSearchItem
) => void;
