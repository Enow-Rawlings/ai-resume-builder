import React, { useRef, useEffect, useState, useCallback } from 'react'

import ClassicTemplate      from './templates/ClassicTemplate'
import ModernTemplate       from './templates/ModernTemplate'
import MinimalTemplate      from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ExecutiveTemplate    from './templates/ExecutiveTemplate'
import TechTemplate         from './templates/TechTemplate'
import CreativeTemplate     from './templates/CreativeTemplate'

const NATURAL_WIDTH = 896 // matches max-w-4xl (56rem @ 16px = 896px)

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const containerRef = useRef(null)
  const innerRef     = useRef(null)
  const [scale, setScale]             = useState(1)
  const [scaledHeight, setScaledHeight] = useState('auto')

  // ── Screen scaling via ResizeObserver ──────────────────────────────
  const updateScale = useCallback(() => {
    if (!containerRef.current || !innerRef.current) return
    const w = containerRef.current.offsetWidth
    const s = Math.min(1, w / NATURAL_WIDTH)
    setScale(s)
    setScaledHeight(innerRef.current.scrollHeight * s)
  }, [])

  useEffect(() => {
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    if (innerRef.current)     ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [data, template, updateScale])

  // ── Print: strip transform before print, restore after ────────────
  // This is the only reliable cross-browser approach.
  // We listen for beforeprint/afterprint and directly mutate the style
  // of the inner div so the browser sees the full-size content.
  useEffect(() => {
    const inner = innerRef.current
    const outer = containerRef.current
    if (!inner || !outer) return

    const beforePrint = () => {
      // Remove scale so the browser sees the template at natural size
      inner.style.transform      = 'none'
      inner.style.width          = '100%'
      inner.style.transformOrigin = 'top left'
      // Remove overflow/height constraint from outer so nothing clips
      outer.style.overflow = 'visible'
      outer.style.height   = 'auto'
    }

    const afterPrint = () => {
      // Restore screen scaling
      inner.style.transform      = `scale(${scale})`
      inner.style.width          = `${NATURAL_WIDTH}px`
      inner.style.transformOrigin = 'top left'
      outer.style.overflow = 'hidden'
      outer.style.height   = `${scaledHeight}px`
    }

    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint',  afterPrint)
    return () => {
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint',  afterPrint)
    }
  }, [scale, scaledHeight])

  // ── Template renderer ──────────────────────────────────────────────
  const renderTemplate = () => {
    switch (template) {
      case 'modern':        return <ModernTemplate        data={data} accentColor={accentColor} />
      case 'minimal':       return <MinimalTemplate       data={data} accentColor={accentColor} />
      case 'minimal-image': return <MinimalImageTemplate  data={data} accentColor={accentColor} />
      case 'executive':     return <ExecutiveTemplate     data={data} accentColor={accentColor} />
      case 'tech':          return <TechTemplate          data={data} accentColor={accentColor} />
      case 'creative':      return <CreativeTemplate      data={data} accentColor={accentColor} />
      default:              return <ClassicTemplate       data={data} accentColor={accentColor} />
    }
  }

  return (
    <div
      ref={containerRef}
      className={'w-full overflow-hidden ' + classes}
      style={{ height: scaledHeight }}
    >
      <div
        ref={innerRef}
        id="resume-preview"
        className="origin-top-left bg-white"
        style={{
          width:           `${NATURAL_WIDTH}px`,
          transform:       `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {renderTemplate()}
      </div>

      {/* Print styles — ALL inside @media print so nothing leaks to screen */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: letter;
          margin: 0;
        }

        @media print {
          /* Hide everything except the resume */
          body * { visibility: hidden; }
          #resume-preview,
          #resume-preview * { visibility: visible; }

          /* Position resume at top-left, full width, no clipping */
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            transform: none !important;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
          }

          /* Force colour backgrounds & images to print */
          #resume-preview,
          #resume-preview * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Preserve coloured header bands */
          #resume-preview header {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: inherit !important;
            color: inherit !important;
          }

          /* ModernTemplate SVG fallback: hide on screen, show on print */
          .print-svg { display: block !important; }
        }

        /* On screen the SVG is hidden (only needed for print colour fidelity) */
        .print-svg { display: none; }
      `}} />
    </div>
  )
}

export default ResumePreview
