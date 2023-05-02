import { useState } from 'react'

const useCopyToClipBoard = () => {
  const [success, setSuccess] = useState(false)

  function copiedText() {
    setSuccess(true)

    const timer = setTimeout(() => {
      setSuccess(false)
      clearTimeout(timer)
    }, 1000)
  }

  function copyToClipboard(text: string) {
    if (!navigator.clipboard) return fallbackCopyTextToClipboard(text)

    navigator.clipboard.writeText(text).then(copiedText)
  }

  return {
    success,
    copyToClipboard,
  }
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}

export default useCopyToClipBoard
