import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

type TruncatedTextProps = {
  text: string
  maxChars?: number
  className?: string
}

export function TruncatedText({
  text,
  maxChars = 40,
  className,
}: TruncatedTextProps) {
  const shouldTruncate = text.length > maxChars
  const displayText = shouldTruncate ? text.slice(0, maxChars) + '…' : text

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-block max-w-xs truncate cursor-help align-middle',
            className,
          )}
        >
          {displayText}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm break-words text-wrap">{text}</TooltipContent>
    </Tooltip>
  )
}
