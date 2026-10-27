/**
 * downloadPdf(filename)
 * Renders #resume-preview to a PDF using html2canvas + jsPDF.
 *
 * html2canvas v1 doesn't support modern CSS color functions (oklch, lab, color())
 * used by Tailwind v4. We resolve all computed colors to rgb() in the cloned DOM
 * before html2canvas processes it.
 */

// CSS color properties that html2canvas needs to paint correctly
const COLOR_PROPS = [
  'color',
  'backgroundColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'outlineColor',
  'textDecorationColor',
  'fill',
  'stroke',
  'caretColor',
  'columnRuleColor',
]

/**
 * Walk every element in the cloned document and inline all computed color
 * values as explicit rgb() strings. This means html2canvas never has to
 * parse oklch / oklab / color() — it just sees ordinary rgb() values.
 *
 * IMPORTANT: the cloned document is detached from the main window, so
 * getComputedStyle must be called on the *original* document's window,
 * passing the matching element by index.
 */
const inlineComputedColors = (originalRoot, clonedRoot) => {
  const originalEls = originalRoot.querySelectorAll('*')
  const clonedEls   = clonedRoot.querySelectorAll('*')

  // Inline the root element itself too
  const resolveEl = (origEl, cloneEl) => {
    if (!origEl || !cloneEl) return
    const computed = window.getComputedStyle(origEl)
    COLOR_PROPS.forEach(prop => {
      const val = computed[prop]
      // Only inline if the browser gave us something — skip empty / 'none'
      if (val && val !== '' && val !== 'none' && val !== 'currentColor') {
        cloneEl.style[prop] = val
      }
    })
  }

  resolveEl(originalRoot, clonedRoot)
  originalEls.forEach((origEl, i) => resolveEl(origEl, clonedEls[i]))
}

export const downloadPdf = async (filename = 'resume') => {
  const el = document.getElementById('resume-preview')
  if (!el) throw new Error('#resume-preview element not found')

  const [html2canvasMod, jspdfMod] = await Promise.all([
    import('html2canvas'),
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

  // Capture the natural dimensions after removing the transform
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
      // Inline all computed colors onto the cloned DOM so html2canvas
      // never has to parse oklch / color() / oklab values from stylesheets.
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById('resume-preview')
        if (clonedEl) {
          inlineComputedColors(el, clonedEl)
        }
      },
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
