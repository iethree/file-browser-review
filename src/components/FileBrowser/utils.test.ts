import type { Folder } from '@types';
import {
  getFolderStackFromPath,
  getPathFromFolderStack,
  isPathFromStack,
} from './utils';

import { mockFileData } from '@test/mock-data';

describe('file browser > utils', () => {
  describe('getFolderStackFromPath', () => {
    it('converts and array of slugified folder names to an array of folders', () => {
      const pathArray = ['all-files', 'tax-returns', 'misc'];
      const folderArray = getFolderStackFromPath(
        pathArray,
        mockFileData as Folder
      );

      expect(folderArray).toEqual([
        mockFileData,
        mockFileData.files[6],
        mockFileData.files[6].files[9],
      ]);
    });

    it('always returns the root folder', () => {
      const folderArray = getFolderStackFromPath([''], mockFileData as Folder);

      expect(folderArray).toEqual([mockFileData]);
    });
  });

  describe('getPathFromFolderStack', () => {
    it('converts an array of folders to a url path of slugified folder names', () => {
      const folderArray = [
        mockFileData,
        mockFileData.files[6],
        mockFileData.files[6].files[9],
      ];

      const pathArray = getPathFromFolderStack(folderArray as Folder[]);

      expect(pathArray).toEqual('all-files/tax-returns/misc');
    });

    it('handles an empty array', () => {
      const pathArray = getPathFromFolderStack([]);

      expect(pathArray).toEqual('');
    });
  });

  describe('isFolderPathFromStack', () => {
    it('returns true for match', () => {
      const folderArray = [
        mockFileData,
        mockFileData.files[6],
        mockFileData.files[6].files[9],
      ];

      const pathArray = ['all-files', 'tax-returns', 'misc'];

      expect(isPathFromStack(pathArray, folderArray as Folder[])).toEqual(true);
    });

    it('returns true for match', () => {
      const folderArray = [
        mockFileData,
        mockFileData.files[6],
        mockFileData.files[6].files[9],
      ];

      const pathArray = ['all-files', 'tax-returns', 'bar'];

      expect(isPathFromStack(pathArray, folderArray as Folder[])).toEqual(
        false
      );
    });
  });
});
