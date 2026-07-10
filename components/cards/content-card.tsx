import { Card, ImagePlaceholder } from "@/components/common/card";
import { cn } from "@/lib/utils";

type ContentCardProps = {
  title: string;
  description?: string;
  className?: string;
  showImage?: boolean;
};

export function ContentCard({
  title,
  description,
  className,
  showImage = false,
}: ContentCardProps) {
  return (
    <Card variant="interactive" className={cn("space-y-5", className)}>
      {showImage ? <ImagePlaceholder /> : null}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description ? <p className="type-body text-muted">{description}</p> : null}
      </div>
    </Card>
  );
}
