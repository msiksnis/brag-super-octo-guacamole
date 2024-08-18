import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps extends React.PropsWithChildren {
  onBottomHit: () => void;
  className?: string;
}

export default function InfiniteScroll({
  children,
  onBottomHit,
  className,
}: InfiniteScrollProps) {
  const { ref } = useInView({
    onChange: (inView) => {
      rootMargin: "200px";
      if (inView) {
        onBottomHit();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
