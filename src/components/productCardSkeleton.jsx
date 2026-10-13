export default function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-[341px] rounded-[8px] border border-black/15 bg-[#F5F5DC] overflow-hidden animate-pulse">
      <div className="h-[300px] bg-black/10" />
      <div className="px-[18px] pb-[18px] pt-[17px] space-y-3">
        <div className="h-2.5 w-1/3 rounded bg-black/10" />
        <div className="h-4 w-3/4 rounded bg-black/10" />
        <div className="h-2.5 w-1/2 rounded bg-black/10" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-5 w-20 rounded bg-black/10" />
          <div className="h-11 w-11 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}
