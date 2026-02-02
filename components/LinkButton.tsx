import { ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';


export default function LinkButton({
  url,
  label,
}: {
  url: string,
  label: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({
          color: 'secondary',
          className: 'gap-2 px-4 py-2 rounded-lg [&_svg]:size-4 [&_svg]:text-fd-muted-foreground no-underline',
        }),
      )}
    >
      {label}
      <ExternalLinkIcon className="inline-block" />
    </a>
  );
}