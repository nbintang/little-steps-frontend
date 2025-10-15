 
import { useEffect, useRef, useState } from "react"

export default function Timer({
  totalSeconds,
  onExpire,
}: {
  totalSeconds: number
  onExpire: () => void
}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    setSecondsLeft(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire()
      return
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [secondsLeft, onExpire])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const formatted = `${mins}:${secs.toString().padStart(2, "0")}`

  return (
    <div aria-live="polite" className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm">
      <span className="font-medium">Time:</span>
      <span className="tabular-nums">{formatted}</span>
    </div>
  )
}
