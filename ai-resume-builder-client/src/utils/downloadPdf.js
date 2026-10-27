/**
 * downloadPdf(filename)
 *
 * Opens a dedicated print window containing only the resume, copies all
 * stylesheets from the main page into it, then triggers the browser's native
 * print dialog (Save as PDF).
 *
 * Why print instead of html2canvas:
 *   - The browser's own renderer handles all CSS including Tailwind v4's
 *     oklch/lab colors, flex, grid, transforms — perfectly.
 *   - No dependency on html2canvas viewport-width quirks.
 *   - Output quality is vector, not a rasterized image.
 */
export const downloadPdf = async (filename = 'resume') => {
  const el = document.getElementById('resume-preview')
  if (!el) throw new Error('#resume-preview element not found')

  // Collect all stylesheets from the current page
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(l => `<link rel="stylesheet" href="${l.href}">`)
    .join('\n')

  const styleBlocks = Array.from(document.querySelectorAll('style'))
    .map(s => `<style>${s.textContent}</style>`)
    .join('\n')

  // Get the resume's inner HTML at its natural (un-transformed) size
  // Temporarily remove the scale transform so cloneNode captures full layout
  const prevTransform = el.style.transform
  el.style.transform  = 'none'
  const resumeHTML    = el.outerHTML
  el.style.transform  = prevTransform

  const printWindow = window.open('', '_blank', 'width=960,height=1200')
  if (!printWindow) {
    throw new Error('Pop-up blocked. Please allow pop-ups for this site and try again.')
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${filename}</title>
  ${styleLinks}
  ${styleBlocks}
  <style>
    /* Reset page margins and ensure the resume fills the page cleanly */
    @page {
      size: A4;
      margin: 0;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: white;
    }
    /* The resume wrapper — render at natural 896px, centered on the page */
    #resume-preview {
      width: 896px !important;
      transform: none !important;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  ${resumeHTML}
  <script>
    // Wait for fonts + images, then print
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.print()
        // Close the window after the print dialog is dismissed
        window.addEventListener('afterprint', function () {
          window.close()
        })
      }, 500)
    })
  </script>
</body>
</html>`)

  printWindow.document.close()
}
