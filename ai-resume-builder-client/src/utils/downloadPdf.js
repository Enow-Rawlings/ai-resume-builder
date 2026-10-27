/**
 * downloadPdf(filename)
 * Renders #resume-preview to a PDF using html2canvas + jsPDF.
 */
export const downloadPdf = async (filename = 'resume') => {
  const el = document.getElementById('resume-preview')
  if (!el) throw new Error('#resume-preview element not found')

  // ── Dynamic import (code-split — only loaded when user clicks Download) ──
  // jsPDF v4 uses named exports; html2canvas uses default export
  const [html2canvasMod, jspdfMod] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])
  const html2canvas = html2canvasMod.default
  // jsPDF v4 exports { jsPDF } as a named export
  const jsPDF = jspdfMod.jsPDF ?? jspdfMod.default?.jsPDF ?? jspdfMod.default

  if (typeof jsPDF !== 'function') {
    throw new Error(`Could not resolve jsPDF constructor. Keys: ${Object.keys(jspdfMod).join(', ')}`)
  }

  // ── 1. Temporarily strip the scale transform so html2canvas captures full size ──
  const prevTransform       = el.style.transform
  const prevWidth           = el.style.width
  const prevTransformOrigin = el.style.transformOrigin

  el.style.transform        = 'none'
  el.style.width            = `${el.scrollWidth}px`
  el.style.transformOrigin  = 'top left'

  const parent      = el.parentElement
  const prevOverflow = parent?.style.overflow ?? ''
  const prevHeight   = parent?.style.height   ?? ''
  if (parent) {
    parent.style.overflow = 'visible'
    parent.style.height   = 'auto'
  }

  // Small delay so the browser repaints at the new size before we capture
  await new Promise(r => setTimeout(r, 150))

  try {
    // ── 2. Capture canvas ──────────────────────────────────────────────────
    const canvas = await html2canvas(el, {
      scale:           2,
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           el.scrollWidth,
      height:          el.scrollHeight,
      windowWidth:     el.scrollWidth,
      windowHeight:    el.scrollHeight,
    })

    const imgData   = canvas.toDataURL('image/jpeg', 0.95)  // JPEG is smaller than PNG
    const imgWidth  = canvas.width
    const imgHeight = canvas.height

    // ── 3. Build A4 PDF ────────────────────────────────────────────────────
    // A4: 210mm × 297mm
    const PDF_W = 210
    const PDF_H = 297

    const ratio         = PDF_W / imgWidth          // mm per canvas pixel
    const contentHeight = imgHeight * ratio         // total content height in mm

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    if (contentHeight <= PDF_H) {
      // Single page
      pdf.addImage(imgData, 'JPEG', 0, 0, PDF_W, contentHeight)
    } else {
      // Multi-page: slice and render each page
      const pagePixels = Math.floor(PDF_H / ratio)  // canvas pixels per page
      let   yPx        = 0

      while (yPx < imgHeight) {
        const slicePx = Math.min(pagePixels, imgHeight - yPx)

        const pageCanvas  = document.createElement('canvas')
        pageCanvas.width  = imgWidth
        pageCanvas.height = slicePx
        const ctx = pageCanvas.getContext('2d')
        ctx.drawImage(canvas, 0, -yPx)

        const sliceMm = slicePx * ratio
        if (yPx > 0) pdf.addPage()
        pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PDF_W, sliceMm)

        yPx += slicePx
      }
    }

    pdf.save(`${filename}.pdf`)

  } finally {
    // ── 4. Always restore original styles ─────────────────────────────────
    el.style.transform        = prevTransform
    el.style.width            = prevWidth
    el.style.transformOrigin  = prevTransformOrigin
    if (parent) {
      parent.style.overflow = prevOverflow
      parent.style.height   = prevHeight
    }
  }
}
