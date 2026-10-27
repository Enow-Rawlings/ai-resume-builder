/**
 * downloadPdf(filename)
 * Renders #resume-preview to a PDF using html2canvas-pro + jsPDF.
 *
 * html2canvas-pro is a maintained fork of html2canvas that supports modern
 * CSS color functions (oklch, oklab, lab, color(), color-mix()) used by
 * Tailwind v4 — no color-scrubbing workarounds needed.
 */

export const downloadPdf = async (filename = 'resume') => {
  const el = document.getElementById('resume-preview')
  if (!el) throw new Error('#resume-preview element not found')

  const [html2canvasMod, jspdfMod] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ])

  const html2canvas = html2canvasMod.default
  const jsPDF = jspdfMod.jsPDF ?? jspdfMod.default?.jsPDF ?? jspdfMod.default

  if (typeof jsPDF !== 'function') {
    throw new Error(`Could not resolve jsPDF constructor. Keys: ${Object.keys(jspdfMod).join(', ')}`)
  }

  // ── 1. Strip scale transform so we capture at natural size ────────
  const prevTransform       = el.style.transform
  const prevWidth           = el.style.width
  const prevTransformOrigin = el.style.transformOrigin

  el.style.transform        = 'none'
  el.style.width            = `${el.scrollWidth}px`
  el.style.transformOrigin  = 'top left'

  const parent       = el.parentElement
  const prevOverflow = parent?.style.overflow ?? ''
  const prevHeight   = parent?.style.height   ?? ''
  if (parent) {
    parent.style.overflow = 'visible'
    parent.style.height   = 'auto'
  }

  await new Promise(r => setTimeout(r, 200))
  const captureWidth  = el.scrollWidth
  const captureHeight = el.scrollHeight

  try {
    // ── 2. Capture canvas ────────────────────────────────────────────
    const canvas = await html2canvas(el, {
      scale:           2,
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           captureWidth,
      height:          captureHeight,
      windowWidth:     captureWidth,
      windowHeight:    captureHeight,
    })

    // ── 3. Build A4 PDF ──────────────────────────────────────────────
    const imgData   = canvas.toDataURL('image/jpeg', 0.95)
    const imgWidth  = canvas.width
    const imgHeight = canvas.height

    const PDF_W = 210  // A4 mm
    const PDF_H = 297

    const ratio         = PDF_W / imgWidth
    const contentHeight = imgHeight * ratio

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    if (contentHeight <= PDF_H) {
      pdf.addImage(imgData, 'JPEG', 0, 0, PDF_W, contentHeight)
    } else {
      // Resume taller than one A4 page — slice into pages
      const pagePixels = Math.floor(PDF_H / ratio)
      let yPx = 0

      while (yPx < imgHeight) {
        const slicePx    = Math.min(pagePixels, imgHeight - yPx)
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width  = imgWidth
        pageCanvas.height = slicePx
        const ctx = pageCanvas.getContext('2d')
        ctx.drawImage(canvas, 0, -yPx)

        if (yPx > 0) pdf.addPage()
        pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PDF_W, slicePx * ratio)
        yPx += slicePx
      }
    }

    pdf.save(`${filename}.pdf`)

  } finally {
    // ── 4. Restore original styles ───────────────────────────────────
    el.style.transform        = prevTransform
    el.style.width            = prevWidth
    el.style.transformOrigin  = prevTransformOrigin
    if (parent) {
      parent.style.overflow = prevOverflow
      parent.style.height   = prevHeight
    }
  }
}
