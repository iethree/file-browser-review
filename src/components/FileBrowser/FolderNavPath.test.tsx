import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FolderNavPath } from './FolderNavPath';

import { mockFileData } from '@test/mock-data';
import { renderAsync } from '@test/helpers';

import type { Folder } from '@types';

describe('File Browser > FolderNavPath', () => {
  it('should show nav path', async () => {
    await renderAsync(
      <FolderNavPath
        folders={[mockFileData as Folder]}
        onFolderSelect={vi.fn()}
      />
    );

    expect(await screen.findByTestId('folder-nav-path')).toBeInTheDocument();
  });

  it('should show root folder name', async () => {
    await renderAsync(
      <FolderNavPath
        folders={[mockFileData as Folder]}
        onFolderSelect={vi.fn()}
      />
    );

    expect(await screen.findByText('All Files')).toBeInTheDocument();
  });

  it('should show nested folders', async () => {
    const folderArray = [
      mockFileData,
      mockFileData.files[6],
      mockFileData.files[6].files[9],
    ] as Folder[];

    await renderAsync(
      <FolderNavPath folders={folderArray} onFolderSelect={vi.fn()} />
    );

    expect(await screen.findByText('All Files')).toBeInTheDocument();
    expect(await screen.findByText('Tax Returns')).toBeInTheDocument();
    expect(await screen.findByText('misc')).toBeInTheDocument();
  });

  it('should fire click handler when a folder name is clicked', async () => {
    const clickSpy = vi.fn();
    const folderArray = [
      mockFileData,
      mockFileData.files[6],
      mockFileData.files[6].files[9],
    ] as Folder[];

    await renderAsync(
      <FolderNavPath folders={folderArray} onFolderSelect={clickSpy} />
    );

    await userEvent.click(screen.getByText('misc'));
    expect(clickSpy).toBeCalled();
  });

  it('should return full folder stack when last folder name is clicked', async () => {
    const clickSpy = vi.fn();
    const folderArray = [
      mockFileData,
      mockFileData.files[6],
      mockFileData.files[6].files[9],
    ] as Folder[];

    await renderAsync(
      <FolderNavPath folders={folderArray} onFolderSelect={clickSpy} />
    );

    await userEvent.click(screen.getByText('misc'));
    expect(clickSpy).toBeCalledWith(folderArray);
  });

  it('should pop off child folders when parent is clicked', async () => {
    const clickSpy = vi.fn();
    const folderArray = [
      mockFileData,
      mockFileData.files[6],
      mockFileData.files[6].files[9],
    ] as Folder[];

    await renderAsync(
      <FolderNavPath folders={folderArray} onFolderSelect={clickSpy} />
    );

    await userEvent.click(screen.getByText('All Files'));
    expect(clickSpy).toBeCalledWith([mockFileData]);
  });
});
