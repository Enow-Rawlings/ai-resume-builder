/**
 * downloadPdf(filename)
 * Renders #resume-preview to a PDF using html2canvas-pro + jsPDF.
 *
 * Strategy: clone the resume element into a position:fixed, off-screen
 * container that is always 896px wide — independent of the viewport width.
 * This guarantees the template's multi-column layout renders correctly
 * regardless of the screen size the user is on.
 */

const NATURAL_WIDTH = 896

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

  // ── 1. Build an off-screen container at full natural width ────────
  // position:fixed + left far off-screen so it doesn't shift the page,
  // but the browser lays it out at the full 896px width.
  const wrapper = document.createElement('div')
  wrapper.style.cssText = [
    'position:fixed',
    'top:0',
    `left:${-NATURAL_WIDTH * 2}px`,   // well off-screen
    `width:${NATURAL_WIDTH}px`,
    'height:auto',
    'overflow:visible',
    'z-index:-9999',
    'background:#ffffff',
    'pointer-events:none',
  ].join(';')

  // Deep-clone the resume element (with all its children / inline styles)
  const clone = el.cloneNode(true)
  clone.style.transform       = 'none'
  clone.style.transformOrigin = 'top left'
  clone.style.width           = `${NATURAL_WIDTH}px`
  clone.style.height          = 'auto'
  clone.removeAttribute('id') // avoid duplicate id in document

  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  // Let the browser reflow the clone at full width
  await new Promise(r => setTimeout(r, 300))

  const captureWidth  = clone.scrollWidth
  const captureHeight = clone.scrollHeight

  try {
    // ── 2. Capture the off-screen clone ──────────────────────────────
    const canvas = await html2canvas(clone, {
      scale:           2,
      useCORS:         true,
      allowTaint:      false,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           captureWidth,
      height:          captureHeight,
      windowWidth:     NATURAL_WIDTH,
      windowHeight:    captureHeight,
      scrollX:         0,
      scrollY:         0,
    })

    // ── 3. Build A4 PDF ──────────────────────────────────────────────
    const imgWidth  = canvas.width
    const imgHeight = canvas.height

    const PDF_W = 210  // A4 mm
    const PDF_H = 297

    const ratio         = PDF_W / imgWidth
    const contentHeight = imgHeight * ratio

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    if (contentHeight <= PDF_H) {
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PDF_W, contentHeight)
    } else {
      const pagePixels = Math.floor(PDF_H / ratio)
      let yPx = 0
      while (yPx < imgHeight) {
        const slicePx    = Math.min(pagePixels, imgHeight - yPx)
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width  = imgWidth
        pageCanvas.height = slicePx
        pageCanvas.getContext('2d').drawImage(canvas, 0, -yPx)
        if (yPx > 0) pdf.addPage()
        pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, PDF_W, slicePx * ratio)
        yPx += slicePx
      }
    }

    pdf.save(`${filename}.pdf`)

  } finally {
    // ── 4. Clean up the off-screen clone ─────────────────────────────
    document.body.removeChild(wrapper)
  }
}
