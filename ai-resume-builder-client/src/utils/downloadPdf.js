/**
 * downloadPdf(filename)
 * Renders #resume-preview to a PDF using html2canvas + jsPDF.
 *
 * html2canvas v1 doesn't support modern CSS color functions (oklch, lab, color())
 * used by Tailwind v4. We use the onclone hook to scrub those from the cloned DOM
 * before capture so html2canvas never encounters them.
 */

/**
 * Walk every element in a root node and replace any computed style property
 * that contains an unsupported CSS color function with a safe fallback.
 */
const scrubModernColors = (root) => {
  const UNSUPPORTED = /\b(oklch|oklab|lab|lch|color|color-mix)\s*\(/gi
  const els = root.querySelectorAll('*')

  els.forEach(el => {
    const computed = window.getComputedStyle(el)
    const props = [
      'color', 'backgroundColor', 'borderColor',
      'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
      'outlineColor', 'textDecorationColor', 'fill', 'stroke',
    ]

    props.forEach(prop => {
      const val = computed[prop]
      if (val && UNSUPPORTED.test(val)) {
        UNSUPPORTED.lastIndex = 0
        // Fallback: keep the element but make the color transparent/default
        // so at least the layout and text render correctly
        if (prop === 'backgroundColor') el.style[prop] = 'transparent'
        else if (prop === 'color') el.style[prop] = '#000000'
        else el.style[prop] = 'transparent'
      }
      UNSUPPORTED.lastIndex = 0
    })

    // Also scrub inline style attribute directly
    if (el.getAttribute('style')) {
      const inlineStyle = el.getAttribute('style')
      if (UNSUPPORTED.test(inlineStyle)) {
        UNSUPPORTED.lastIndex = 0
        el.setAttribute('style', inlineStyle.replace(UNSUPPORTED, (match) => {
          // replace the whole function call — find balanced parens
          return 'transparent'
        }))
      }
      UNSUPPORTED.lastIndex = 0
    }
  })
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

  // Small delay so the browser repaints before capture
  await new Promise(r => setTimeout(r, 150))

  try {
    // ── 2. Capture canvas ────────────────────────────────────────────
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
      // Scrub modern CSS color functions before html2canvas tries to parse them
      onclone: (_doc, clonedEl) => {
        scrubModernColors(clonedEl)
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
