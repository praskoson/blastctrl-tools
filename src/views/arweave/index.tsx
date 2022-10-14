import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useWallet, useLocalStorage } from '@solana/wallet-adapter-react';
import { ChangeEvent, useState, DragEvent, useEffect } from 'react';
import { BundlrStorageDriver } from 'utils/bundlr-storage';
import { notify } from 'utils/notifications';
import { Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import { Amount, Currency, formatAmount } from 'types';
import { Uploads } from './Uploads';
import { useNetworkConfiguration } from 'contexts/NetworkConfigurationProvider';

export type UploadedFile = {
  name: string;
  contentType: string;
  uri: string;
  uploadDate: number;
};

const classNames = (...args: any[]) => args.filter(Boolean).join(' ');
function pascalify(text: string) {
  text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  return text.substring(0, 1).toUpperCase() + text.substring(1);
}

export const UploaderView = ({ storage }: { storage: BundlrStorageDriver }) => {
  const { connected } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File>();
  const [filePrice, setFilePrice] = useState<Amount<Currency>>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useLocalStorage<UploadedFile[]>(
    `previousUploads${pascalify(networkConfiguration)}`,
    []
  );

  useEffect(() => {
    (async () => {
      if (file) {
        storage.getUploadPrice(file.size).then((price) => setFilePrice(price));
      } else {
        setFilePrice(null);
      }
    })();
  }, [storage, file]);

  const handleDrag = (event: DragEvent<HTMLFormElement | HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLFormElement | HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleSetFile = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target?.files?.length === 1) {
      setFile(event.target.files.item(0));
    }
  };

  const handleCancel = (e: any) => {
    e.preventDefault();
    setFile(null);
    setIsUploading(false);
  };

  const handleUpload = async () => {
    if (!connected) {
      notify({ type: 'error', message: 'Connect your wallet' });
      return;
    }

    try {
      setIsUploading(true);
      const uri = await storage.upload(file);
      setUploads((uploads) => [
        {
          name: file.name,
          contentType: file.type,
          uri,
          uploadDate: Date.now(),
        },
        ...uploads,
      ]);
      notify({
        type: 'success',
        message: 'Upload succesful!',
        description: `The file is available at ${uri}`,
      });
      setFile(null);
    } catch (err) {
      console.log(err);
      notify({
        type: 'error',
        message: 'Error uploading',
        description: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // TODO: add FAQ, disclosures
  return (
    <div className='md:hero mx-auto px-4'>
      <div className='md:hero-content flex flex-col'>
        <div className='mb-4 sm:mb-0 sm:border-b sm:border-gray-200 sm:pb-3'>
          <h1 className='text-center text-3xl font-semibold text-gray-900 font-display mb-2'>
            Simple Arweave Uploader
          </h1>
          <p className='text-sm text-gray-900 tracking-tight leading-snug text-center'>
            Upload files to Arweave using the Bundlr Network and paying in SOL.
          </p>
        </div>

        {/* Drop upload */}
        <div>
          <Transition
            as='form'
            onSubmit={(e) => e.preventDefault()}
            onDragEnter={handleDrag}
            show={!file}
            enter='transform transition duration-75'
            enterFrom='translate-y-20 opacity-50'
            enterTo='translate-y-0 opacity-100'>
            <div className='sm:grid sm:grid-cols-2 sm:items-start sm:gap-4'>
              <div className='mt-1 sm:col-span-2 sm:mt-0'>
                <div
                  className={classNames(
                    'flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors',
                    dragActive && 'bg-accent/30'
                  )}>
                  <div className='space-y-1 text-center'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
                      stroke='currentColor'
                      fill='none'
                      viewBox='0 0 48 48'
                      aria-hidden='true'>
                      <path
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <div className='flex text-sm text-gray-600'>
                      <label
                        htmlFor='file-upload'
                        className='relative cursor-pointer rounded-md font-medium text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2 hover:text-secondary-focus'>
                        <span>Upload a file</span>
                        <input
                          id='file-upload'
                          name='file-upload'
                          type='file'
                          className='sr-only'
                          onChange={handleSetFile}
                        />
                      </label>
                      <p className='pl-1'>or drag and drop</p>
                    </div>
                    <p className='text-xs text-gray-500'>
                      Use files that are up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {dragActive && (
                <div
                  draggable={true}
                  className='absolute h-full w-full inset-0'
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}></div>
              )}
            </div>
          </Transition>

          {/* File data and upload */}
          <Transition
            as='div'
            show={!!file}
            appear={true}
            enter='transform transition'
            enterFrom='-translate-x-20 opacity-50'
            enterTo='translate-x-0 opacity-100'>
            {file && (
              <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
                <div className='px-4 py-5 sm:px-6'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    File Information
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    Metadata and upload cost.
                  </p>
                </div>
                <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
                  <dl className='sm:divide-y sm:divide-gray-200'>
                    <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        File name
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                        {file.name}
                      </dd>
                    </div>
                    <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Type
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                        {file.type}
                      </dd>
                    </div>
                    <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Size
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                        {(file.size / (2 ^ 10)).toFixed(2)} KB
                      </dd>
                    </div>
                    <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Last modified
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                        {dayjs(file.lastModified).fromNow()}
                      </dd>
                    </div>
                    <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                      <dt className='text-sm font-medium text-gray-500'>
                        Estimated cost
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                        {filePrice && formatAmount(filePrice)}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className='border-t border-gray-200 bg-gray-50'>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className='py-2 flex justify-center gap-1 sm:gap-2'>
                    <button
                      type='button'
                      disabled={!file}
                      onClick={handleCancel}
                      className={classNames(
                        'inline-flex items-center rounded-md border border-transparent bg-secondary/20 px-4 py-2 text-base font-medium text-secondary shadow-sm',
                        'hover:bg-secondary/30 enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-secondary enabled:focus:ring-offset-2',
                        'disabled:bg-secondary/10 disabled:text-secondary/60 disabled:pointer-events-none'
                      )}>
                      Cancel
                    </button>
                    <button
                      type='button'
                      disabled={!file}
                      onClick={handleUpload}
                      className={classNames(
                        'inline-flex items-center rounded-md border border-transparent bg-secondary px-4 py-2 text-base font-medium text-white shadow-sm',
                        'hover:bg-secondary-focus enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-secondary enabled:focus:ring-offset-2',
                        'disabled:bg-slate-700/50 disabled:pointer-events-none'
                      )}>
                      {isUploading && (
                        <ArrowPathIcon
                          className='-ml-1 mr-3 h-5 w-5 animate-spin'
                          aria-hidden='true'
                        />
                      )}
                      {isUploading ? 'Uploading' : 'Upload'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </Transition>
        </div>

        {uploads?.length > 0 && (
          <div className='my-4 sm:my-6'>
            <Uploads files={uploads} />
          </div>
        )}
      </div>
    </div>
  );
};
