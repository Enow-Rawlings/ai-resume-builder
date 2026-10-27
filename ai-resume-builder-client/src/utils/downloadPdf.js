/**
 * downloadPdf(filename)
 * Renders #resume-preview to a PDF using html2canvas + jsPDF.
 *
 * html2canvas v1 throws on modern CSS color functions (oklch, lab, color(), etc.)
 * used by Tailwind v4. Strategy:
 *   1. In the onclone hook, walk every element and inline ALL computed styles
 *      as explicit values (getComputedStyle gives us resolved rgb() values).
 *   2. Remove every <style> and <link rel="stylesheet"> from the cloned document
 *      so html2canvas never even tries to parse the raw Tailwind CSS rules.
 * After this, html2canvas only sees plain inline styles — no color functions.
 */

// All CSS properties we need to inline so layout + paint look correct
const ALL_STYLE_PROPS = [
  // Colors
  'color', 'backgroundColor',
  'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
  'outlineColor', 'textDecorationColor', 'fill', 'stroke',
  // Box model
  'display', 'position', 'top', 'right', 'bottom', 'left',
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'boxSizing',
  // Border
  'borderWidth', 'borderStyle',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
  'borderRadius',
  'borderTopLeftRadius', 'borderTopRightRadius',
  'borderBottomLeftRadius', 'borderBottomRightRadius',
  // Flexbox / Grid
  'flexDirection', 'flexWrap', 'justifyContent', 'alignItems', 'alignSelf',
  'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'gap', 'rowGap', 'columnGap',
  'gridTemplateColumns', 'gridTemplateRows', 'gridColumn', 'gridRow',
  // Typography
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight',
  'letterSpacing', 'textAlign', 'textTransform', 'textDecoration',
  'whiteSpace', 'wordBreak', 'overflowWrap',
  // Visual
  'opacity', 'overflow', 'overflowX', 'overflowY',
  'boxShadow', 'textShadow',
  'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
  'objectFit', 'objectPosition',
  'verticalAlign', 'listStyleType',
  'zIndex', 'visibility',
]

/**
 * Inline all computed styles onto every cloned element, then strip all
 * stylesheets from the cloned document. html2canvas will only see the
 * inlined values — no raw CSS rules with unsupported color functions.
 */
const prepareClone = (originalRoot, clonedDoc) => {
  const originalEls = [originalRoot, ...originalRoot.querySelectorAll('*')]
  const clonedRoot  = clonedDoc.getElementById(originalRoot.id)
  const clonedEls   = clonedRoot ? [clonedRoot, ...clonedRoot.querySelectorAll('*')] : []

  originalEls.forEach((origEl, i) => {
    const cloneEl = clonedEls[i]
    if (!cloneEl) return
    const computed = window.getComputedStyle(origEl)
    ALL_STYLE_PROPS.forEach(prop => {
      try {
        const val = computed[prop]
        if (val !== undefined && val !== '') {
          cloneEl.style[prop] = val
        }
      } catch (_) {
        // ignore unsettable properties
      }
    })
  })

  // Remove ALL stylesheets so html2canvas never parses raw CSS rules
  clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach(n => n.remove())
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
      onclone: (clonedDoc) => {
        // Inline all computed styles and strip raw CSS rules so html2canvas
        // never encounters oklch / lab / color() in stylesheet text.
        prepareClone(el, clonedDoc)
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
