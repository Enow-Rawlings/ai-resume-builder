/**
 * downloadPdf(filename)
 * Renders #resume-preview to a PDF using html2canvas-pro + jsPDF.
 *
 * html2canvas-pro supports modern CSS color functions (oklch, oklab, lab,
 * color(), color-mix()) used by Tailwind v4.
 *
 * The #resume-preview element is normally scaled down via CSS transform to fit
 * the viewport. Before capture we remove the transform and expand all ancestor
 * overflow/height constraints so html2canvas sees the full natural layout.
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

  // ── 1. Collect ancestors to un-clip ──────────────────────────────
  // Walk up to <body> and save overflow + height on every ancestor so
  // none of them clip the full-size resume during capture.
  const ancestors = []
  let node = el.parentElement
  while (node && node !== document.body) {
    ancestors.push({
      el:          node,
      overflow:    node.style.overflow,
      overflowX:   node.style.overflowX,
      overflowY:   node.style.overflowY,
      height:      node.style.height,
      maxHeight:   node.style.maxHeight,
    })
    node = node.parentElement
  }

  // ── 2. Remove transform + expand ancestors ────────────────────────
  const prevTransform       = el.style.transform
  const prevWidth           = el.style.width
  const prevTransformOrigin = el.style.transformOrigin
  const prevHeight          = el.style.height

  el.style.transform        = 'none'
  el.style.transformOrigin  = 'top left'
  el.style.width            = '896px'   // NATURAL_WIDTH — always render at full size
  el.style.height           = 'auto'

  ancestors.forEach(({ el: a }) => {
    a.style.overflow  = 'visible'
    a.style.overflowX = 'visible'
    a.style.overflowY = 'visible'
    a.style.height    = 'auto'
    a.style.maxHeight = 'none'
  })

  // Let the browser reflow and repaint at full natural size
  await new Promise(r => setTimeout(r, 300))

  const captureWidth  = el.scrollWidth
  const captureHeight = el.scrollHeight

  try {
    // ── 3. Capture canvas at natural size ────────────────────────────
    const canvas = await html2canvas(el, {
      scale:           2,          // 2× for crisp output
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           captureWidth,
      height:          captureHeight,
      windowWidth:     captureWidth,
      windowHeight:    captureHeight,
      scrollX:         0,
      scrollY:         0,
    })

    // ── 4. Build A4 PDF ──────────────────────────────────────────────
    const imgWidth  = canvas.width   // pixels at 2× scale
    const imgHeight = canvas.height

    const PDF_W = 210  // A4 width  in mm
    const PDF_H = 297  // A4 height in mm

    const ratio         = PDF_W / imgWidth
    const contentHeight = imgHeight * ratio  // how tall the content is in mm

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    if (contentHeight <= PDF_H) {
      // Fits on a single page
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PDF_W, contentHeight)
    } else {
      // Slice into multiple A4 pages
      const pagePixels = Math.floor(PDF_H / ratio)
      let yPx = 0

      while (yPx < imgHeight) {
        const slicePx    = Math.min(pagePixels, imgHeight - yPx)
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width  = imgWidth
        pageCanvas.height = slicePx
        pageCanvas.getContext('2d').drawImage(canvas, 0, -yPx)

        if (yPx > 0) pdf.addPage()
        pdf.addImage(
          pageCanvas.toDataURL('image/jpeg', 0.95),
          'JPEG', 0, 0, PDF_W, slicePx * ratio
        )
        yPx += slicePx
      }
    }

    pdf.save(`${filename}.pdf`)

  } finally {
    // ── 5. Restore original styles ───────────────────────────────────
    el.style.transform        = prevTransform
    el.style.transformOrigin  = prevTransformOrigin
    el.style.width            = prevWidth
    el.style.height           = prevHeight

    ancestors.forEach(({ el: a, overflow, overflowX, overflowY, height, maxHeight }) => {
      a.style.overflow  = overflow
      a.style.overflowX = overflowX
      a.style.overflowY = overflowY
      a.style.height    = height
      a.style.maxHeight = maxHeight
    })
  }
}
