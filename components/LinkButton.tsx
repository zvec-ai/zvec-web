import { ExternalLinkIcon } from 'lucide-react';
import { FaPython, FaNodeJs } from "react-icons/fa";
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';


export function LinkButton({
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


export function PythonLinkButton({
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
          className: 'gap-2 px-3 py-1 rounded-lg no-underline',
        }),
        'flex items-center'
      )}
    >
      <FaPython className="h-6 w-6 text-orange-400 dark:text-[#FF8C00]" />
      {label}
    </a>
  );
}


export function NodeJSLinkButton({
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
          className: 'gap-2 px-3 py-1 rounded-lg no-underline',
        }),
        'flex items-center'
      )}
    >
      <FaNodeJs className="h-6 w-6 text-green-600 dark:text-green-400" />
      {label}
    </a>
  );
}