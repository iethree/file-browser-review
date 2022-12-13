import {
  DocumentIcon,
  DocumentTextIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/solid';
import { FolderIcon } from '@heroicons/react/24/outline';
import type { Folder, File, FileItem } from '@types';
import { FolderSelectAction, FileSearchItem, isFileSearchItem } from './types';

import { Menu } from 'react-daisyui';
import { clipLastFolder } from './utils';

const iconClasses = 'w-12 mr-2 flex-shrink-0 text-primary';

export const FolderOrFileComponent = ({
  item,
  onFolderSelect,
}: {
  item: FileItem | FileSearchItem;
  onFolderSelect?: FolderSelectAction;
}) =>
  item.type === 'folder' ? (
    <FolderComponent folder={item as Folder} onFolderSelect={onFolderSelect} />
  ) : (
    <FileComponent file={item as File} />
  );

const FolderComponent = ({
  folder,
  onFolderSelect,
}: {
  folder: Folder | FileSearchItem;
  onFolderSelect?: FolderSelectAction;
}) => {
  return (
    <Menu.Item
      onClick={onFolderSelect ? () => onFolderSelect(folder) : undefined}
      data-testid='folder-item'
    >
      <a>
        <FolderIcon className={iconClasses} />
        {folder.name}
        {isFileSearchItem(folder) && (
          <FilePath path={clipLastFolder(folder.path)} />
        )}
      </a>
    </Menu.Item>
  );
};

const FileComponent = ({ file }: { file: File }) => {
  return (
    <Menu.Item className='w-full' data-testid='file-item'>
      <a
        className='w-full'
        href={`/api/file/${file.id}/${file.name}`}
        download={file.name}
      >
        <DocIcon fileName={file.name} />
        <div className='min-w-0'>
          <div className='mb-1 overflow-hidden overflow-ellipsis'>
            {file.name}
          </div>
          <div className='text-xs text-gray-500'>
            {isFileSearchItem(file) && <FilePath path={file.path} />}
          </div>
        </div>
      </a>
    </Menu.Item>
  );
};

export const DocIcon = ({ fileName }: { fileName: string }) => {
  const extension = /(?:\.([^.]+))?$/.exec(fileName)?.[1]?.replace(/x$/i, '');

  if (!extension) {
    return <DocumentIcon className={iconClasses} data-testid='fallback-icon' />;
  }

  const ExtMap: Record<string, React.ReactElement> = {
    doc: <DocumentTextIcon className={iconClasses} />,
    pdf: <DocumentIcon className={iconClasses} />,
    xls: (
      <DocumentChartBarIcon
        className={iconClasses}
        data-testid='doc-chart-bar-icon'
      />
    ),
  };

  return ExtMap[extension] ?? <DocumentIcon className={iconClasses} />;
};

const FilePath = ({ path }: { path: string }) => (
  <span className='text-xs text-gray-500 ml-2 break-words'>{path}</span>
);
