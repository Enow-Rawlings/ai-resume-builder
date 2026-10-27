/**
 * downloadPdf(filename)
 *
 * Renders the #resume-preview element to a PDF using html2canvas + jsPDF.
 * Works regardless of browser print restrictions, COOP headers, or transform scaling.
 *
 * Steps:
 *  1. Find #resume-preview and temporarily reset its CSS transform so html2canvas
 *     captures the full-size content (not the scaled-down preview version).
 *  2. Render to canvas at 2× device pixel ratio for crisp PDF output.
 *  3. Fit the canvas onto A4/letter pages and save as PDF.
 *  4. Restore the original transform.
 */
export const downloadPdf = async (filename = 'resume') => {
  const el = document.getElementById('resume-preview')
  if (!el) {
    console.error('downloadPdf: #resume-preview element not found')
    return
  }

  // Dynamically import so the libraries are code-split and not in the main bundle
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  // ── 1. Temporarily reset transform so we capture at natural size ──
  const prevTransform      = el.style.transform
  const prevWidth          = el.style.width
  const prevTransformOrigin = el.style.transformOrigin

  el.style.transform       = 'none'
  el.style.width           = '100%'
  el.style.transformOrigin = 'top left'

  // Also un-clip the parent overflow so nothing is cropped
  const parent = el.parentElement
  const prevOverflow = parent ? parent.style.overflow : ''
  const prevHeight   = parent ? parent.style.height   : ''
  if (parent) {
    parent.style.overflow = 'visible'
    parent.style.height   = 'auto'
  }

  try {
    // ── 2. Render to canvas ──────────────────────────────────────────
    const canvas = await html2canvas(el, {
      scale: 2,               // 2× for retina-quality output
      useCORS: true,          // allow cross-origin images (profile photos)
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      // Capture the full scroll height, not just the visible portion
      windowWidth:  el.scrollWidth,
      windowHeight: el.scrollHeight,
    })

    // ── 3. Build PDF ─────────────────────────────────────────────────
    const imgData  = canvas.toDataURL('image/png')
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // A4 in mm: 210 × 297  |  Letter in mm: 215.9 × 279.4
    // We'll use A4 portrait as the standard
    const pdfWidth  = 210   // mm
    const pdfHeight = 297   // mm

    // Scale to fit full width on one page, then paginate the height
    const ratio       = pdfWidth / imgWidth
    const scaledHeight = imgHeight * ratio  // rendered height in mm

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    if (scaledHeight <= pdfHeight) {
      // Fits on a single page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight)
    } else {
      // Multi-page: slice canvas height into A4-sized segments
      const pageHeightPx = pdfHeight / ratio   // height of one page in canvas pixels
      let   yOffset      = 0

      while (yOffset < imgHeight) {
        const sliceHeight = Math.min(pageHeightPx, imgHeight - yOffset)

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width  = imgWidth
        pageCanvas.height = sliceHeight
        const ctx = pageCanvas.getContext('2d')
        ctx.drawImage(canvas, 0, -yOffset)

        const pageImgData    = pageCanvas.toDataURL('image/png')
        const pageHeightMm   = sliceHeight * ratio

        if (yOffset > 0) pdf.addPage()
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageHeightMm)

        yOffset += sliceHeight
      }
    }

    pdf.save(`${filename}.pdf`)
  } finally {
    // ── 4. Always restore original styles ───────────────────────────
    el.style.transform       = prevTransform
    el.style.width           = prevWidth
    el.style.transformOrigin = prevTransformOrigin
    if (parent) {
      parent.style.overflow = prevOverflow
      parent.style.height   = prevHeight
    }
  }
}
