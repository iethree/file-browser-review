import { within } from '@testing-library/dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { renderAsync } from '@test/helpers';
import { mockFileData } from '@test/mock-data';

import type { Folder } from '@types';

import { FileBrowser } from './FileBrowser';
import { DocIcon } from './FileDisplay';

describe('File Browser', () => {
  const MockRouter = ({
    children,
    initialEntries = [''],
  }: {
    children: React.ReactNode;
    initialEntries: string[];
  }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path='/files/*' element={children} />
      </Routes>
    </MemoryRouter>
  );

  it('should render file browser component', async () => {
    await renderAsync(
      <MemoryRouter>
        <FileBrowser />
      </MemoryRouter>
    );

    expect(await screen.findByTestId('file-browser')).toBeInTheDocument();
  });

  it('should have an empty state', async () => {
    const emptyFiles = {
      id: 'abc-123',
      teamId: 'abc-123',
      type: 'folder',
      name: 'empty folder',
      files: [],
      created_at: '2022-10-10T11:04:04.417407+00:00',
      updated_at: '2022-10-18T11:04:04.417407+00:00',
    } as Folder;

    await renderAsync(
      <MemoryRouter>
        <FileBrowser rootFolder={emptyFiles as Folder} />
      </MemoryRouter>
    );

    expect(await screen.findByText('No Files Found')).toBeInTheDocument();
  });

  it('should display top level folder names', async () => {
    await renderAsync(
      <MemoryRouter>
        <FileBrowser rootFolder={mockFileData as Folder} />
      </MemoryRouter>
    );

    const folderNames = [
      'Monthly Financial Reports',
      'Financial Statements',
      'Tax Returns',
      'Corporate Documents',
      'Bank Statements',
      'Payroll Records',
      'Contracts',
      'Accounts Payable',
      'Information',
      'Other',
    ];

    folderNames.forEach(async (name) => {
      expect(await screen.findByText(name)).toBeInTheDocument();
    });
  });

  it('should navigate to a subfolder on click', async () => {
    await renderAsync(
      <MemoryRouter>
        <FileBrowser rootFolder={mockFileData as Folder} />
      </MemoryRouter>
    );
    const folder = mockFileData.files[6];

    await userEvent.click(await screen.findByText(folder.name));

    folder.files.forEach(({ name }) =>
      expect(screen.getByText(name)).toBeInTheDocument()
    );
  });

  it('should navigate 2 subfolders deep on click', async () => {
    await renderAsync(
      <MemoryRouter>
        <FileBrowser rootFolder={mockFileData as Folder} />
      </MemoryRouter>
    );
    const folder = mockFileData.files[6];
    const subfolder = folder.files[9];

    await userEvent.click(await screen.findByText(folder.name));
    await userEvent.click(await screen.findByText(subfolder.name));

    subfolder.files?.forEach(({ name }) =>
      expect(screen.getByText(name)).toBeInTheDocument()
    );
  });

  describe('FileBrowser > url loading', () => {
    it('should load 2 subfolders deep from URL', async () => {
      await renderAsync(
        <MockRouter initialEntries={['/files/all-files/tax-returns/misc']}>
          <FileBrowser rootFolder={mockFileData as Folder} />
        </MockRouter>
      );
      const folder = mockFileData.files[6];
      const subfolder = folder.files[9];

      subfolder.files?.forEach(({ name }) =>
        expect(screen.getByText(name)).toBeInTheDocument()
      );
    });
  });

  describe('FileBrowser > folder nav path', () => {
    it('should have a nav path', async () => {
      await renderAsync(
        <MemoryRouter>
          <FileBrowser rootFolder={mockFileData as Folder} />
        </MemoryRouter>
      );

      expect(await screen.findByTestId('folder-nav-path')).toBeInTheDocument();
    });

    it('Nav path should display root folder name', async () => {
      await renderAsync(
        <MemoryRouter>
          <FileBrowser rootFolder={mockFileData as Folder} />
        </MemoryRouter>
      );

      expect(await screen.findByText('All Files')).toBeInTheDocument();
    });
  });

  describe('FileBrowser > FileDisplay', () => {
    it('should show a chart icon for a an excel file', async () => {
      await renderAsync(<DocIcon fileName='foo.xlsx' />);
      screen.getByTestId('doc-chart-bar-icon');
    });
    it('should show a generic icon for a file without an extension', async () => {
      await renderAsync(<DocIcon fileName='foo' />);
      screen.getByTestId('fallback-icon');
    });
  });
});
