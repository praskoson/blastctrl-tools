import { useAutoAnimate } from '@formkit/auto-animate/react';
import { LinkIcon } from '@heroicons/react/20/solid';
import {
  CodeBracketIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PlayCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { BsBraces } from 'react-icons/bs';
import { CopyButton } from 'components/CopyButton';
import dayjs from 'dayjs';
import Image from 'next/image';
import { memo, useState } from 'react';
import { UploadedFile } from '.';

type UploadsProps = {
  files: UploadedFile[];
};

const getFilePreview = (item: UploadedFile) => {
  // startsWith: text, audio, video, image | special: application/json, text/javascript
  if (item.contentType === 'application/json') {
    return <BsBraces className='h-8 w-8 rounded-md' />;
  }

  if (
    item.contentType === 'text/javascript' ||
    item.contentType === 'text/html'
  ) {
    return <CodeBracketIcon className='h-8 w-8 rounded-md' />;
  }

  const type = item.contentType.split('/')[0];
  switch (type) {
    case 'text':
      return <DocumentTextIcon className='h-8 w-8 rounded-md' />;
    case 'video':
      return <PlayCircleIcon className='h-8 w-8 rounded-md' />;
    case 'audio':
      return <MusicalNoteIcon className='h-8 w-8 rounded-md' />;
    case 'image':
      return (
        <Image
          width={40}
          height={40}
          className='h-8 w-8 rounded-md object-cover object-center'
          src={item.uri}
          alt=''
        />
      );
    default:
      return <QuestionMarkCircleIcon className='h-8 w-8 rounded-md' />;
  }
};

export const Uploads = memo(({ files }: UploadsProps) => {
  const [parent] = useAutoAnimate<HTMLUListElement>();
  const [length, setLength] = useState(5);

  const handleShowMore = () => {
    setLength((prev) => prev + 5);
  };

  return (
    <div>
      <h2 className='font-semibold font-xl text-slate-700 mb-2 sm:mb-4'>
        Previous uploads
      </h2>
      <ul ref={parent} role='list' className='space-y-3'>
        {files.slice(0, length).map((item, idx) => (
          <li
            key={idx}
            className='overflow-hidden bg-white px-4 py-3 shadow sm:rounded-md sm:px-6'>
            <div className='flex items-center space-x-4'>
              <div className='flex-shrink-0'>{getFilePreview(item)}</div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-gray-900'>
                  {item.name}
                </p>
                <p className='truncate text-sm text-gray-500'>
                  {dayjs(item.uploadDate).fromNow()}
                </p>
              </div>
              <div className='space-x-1 inline-flex'>
                <CopyButton content={item.uri}>
                  <a
                    rel='noreferrer noopener'
                    className='inline-flex items-center rounded-full h-7 border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:cursor-pointer'>
                    <LinkIcon className='h-4 w-4 mx-0.5' />
                    Copy
                  </a>
                </CopyButton>
                <a
                  rel='noreferrer noopener'
                  target='_blank'
                  download={item.name}
                  href={item.uri}
                  className='inline-flex items-center justify-center rounded-full border h-7 border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'>
                  Open
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {files.length > length && (
        <button
          onClick={handleShowMore}
          type='button'
          className='inline-flex w-full items-center justify-center mt-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:ring-offset-1'>
          Show more
        </button>
      )}
    </div>
  );
});
