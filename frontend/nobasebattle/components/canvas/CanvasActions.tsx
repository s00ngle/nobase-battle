interface CanvasActionsProps {
  onClear: () => void
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export const CanvasActions = ({
  onClear,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: CanvasActionsProps) => {
  return (
    <div className="flex justify-center mt-2 gap-3">
      <div
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90 w-fit h-fit transition-transform duration-200"
        onClick={onClear}
        title="모두 지우기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <title>모두 지우기</title>
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </div>
      <div
        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90 w-fit h-fit transition-transform duration-200"
        onClick={onSave}
        title="그림 저장하기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <title>그림 저장하기</title>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </div>
      <div
        className={`p-1.5 rounded-md ${
          !canUndo
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90'
        } w-fit h-fit transition-transform duration-200`}
        onClick={canUndo ? onUndo : undefined}
        title="실행 취소 (Ctrl+Z)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <title>실행 취소</title>
          <polyline points="9 14 4 9 9 4" />
          <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </svg>
      </div>
      <div
        className={`p-1.5 rounded-md ${
          !canRedo
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer active:scale-90'
        } w-fit h-fit transition-transform duration-200`}
        onClick={canRedo ? onRedo : undefined}
        title="다시 실행 (Ctrl+Shift+Z)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <title>다시 실행</title>
          <polyline points="15 4 20 9 15 14" />
          <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
        </svg>
      </div>
    </div>
  )
}
