import { Heading } from "@/components/common/heading";
import { Lead } from "@/components/common/typography";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-5">
      <Heading eyebrow={eyebrow}>{title}</Heading>
      {description ? <Lead>{description}</Lead> : null}
    </div>
  );
}
