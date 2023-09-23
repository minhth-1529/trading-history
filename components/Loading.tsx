export default function LoadingComponent() {
  return (
    <div className={'flex h-full w-full items-center justify-center'}>
      <span className="inline-block h-8 w-8 animate-spin-slow rounded-full border-4 border-dashed dark:border-violet-400"></span>
    </div>
  );
}
