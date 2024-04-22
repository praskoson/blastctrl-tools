import {
  CodeBracketIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PlayCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { CopyButton } from "components/copy-button";
import dayjs from "dayjs";
import Image from "next/legacy/image";
import { memo, useState } from "react";
import { UploadedFile } from ".";

type UploadsProps = {
  files: UploadedFile[];
};

const getFilePreview = (item: UploadedFile) => {
  // startsWith: text, audio, video, image | special: application/json, text/javascript
  if (item.contentType === "application/json") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-10 w-10 rounded-md"
      >
        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
        <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
      </svg>
    );
  }

  if (item.contentType === "text/javascript" || item.contentType === "text/html") {
    return <CodeBracketIcon className="h-10 w-10 rounded-md" />;
  }

  const type = item.contentType.split("/")[0];
  switch (type) {
    case "text":
      return <DocumentTextIcon className="h-10 w-10 rounded-md" />;
    case "video":
      return <PlayCircleIcon className="h-10 w-10 rounded-md" />;
    case "audio":
      return <MusicalNoteIcon className="h-10 w-10 rounded-md" />;
    case "image":
      return (
        <Image
          width={40}
          height={40}
          className="h-8 w-8 rounded-md object-cover object-center"
          src={item.uri}
          alt=""
        />
      );
    default:
      return <QuestionMarkCircleIcon className="h-10 w-10 rounded-md" />;
  }
};

export const Uploads = memo(function Uploads({ files }: UploadsProps) {
  const [length, setLength] = useState(5);

  const handleShowMore = () => {
    setLength((prev) => prev + 5);
  };

  return (
    <div>
      <h2 className="font-xl mb-2 font-semibold text-slate-700 sm:mb-4">Previous uploads</h2>
      <ul role="list" className="space-y-3">
        {files.slice(0, length).map((item, idx) => (
          <li key={idx} className="overflow-hidden bg-white px-4 py-3 shadow sm:rounded-md sm:px-6">
            <div className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex gap-x-4 self-start sm:self-auto">
                <div className="flex-shrink-0">{getFilePreview(item)}</div>
                <div className="min-w-0 flex-1">
                  <p className="break-all text-sm font-medium text-gray-900 sm:max-w-xs">
                    {item.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {dayjs(item.uploadDate).fromNow()}
                  </p>
                </div>
              </div>
              <div className="inline-flex space-x-1 pt-1 sm:pt-0">
                <CopyButton
                  clipboard={item.uri}
                  className="inline-flex h-7 items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium text-gray-700 shadow-sm hover:cursor-pointer hover:bg-gray-50"
                >
                  {(props) => (props.copied ? "Copied!" : "Copy")}
                </CopyButton>
                <a
                  rel="noreferrer noopener"
                  target="_blank"
                  download={item.name}
                  href={item.uri}
                  className="inline-flex h-7 items-center justify-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
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
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:ring-offset-1"
        >
          Show more
        </button>
      )}
    </div>
  );
});
