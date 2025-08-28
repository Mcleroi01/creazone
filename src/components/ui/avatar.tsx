import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@lib/utils';

const avatarVariants = cva(
  "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    if (imgError || !src) {
      return (
        <div className={cn(avatarVariants({ size, className }))}>
          <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            {fallback}
          </span>
        </div>
      )
    }

    return (
      <div className={cn(avatarVariants({ size, className }))}>
        <img
          ref={ref}
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
          {...props}
        />
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
