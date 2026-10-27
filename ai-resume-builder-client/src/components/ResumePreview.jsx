import React, { useRef, useEffect, useState, useCallback } from 'react'

import ClassicTemplate      from './templates/ClassicTemplate'
import ModernTemplate       from './templates/ModernTemplate'
import MinimalTemplate      from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ExecutiveTemplate    from './templates/ExecutiveTemplate'
import TechTemplate         from './templates/TechTemplate'
import CreativeTemplate     from './templates/CreativeTemplate'

const NATURAL_WIDTH = 896 // max-w-4xl = 56rem @ 16px base

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const containerRef = useRef(null)
  const innerRef     = useRef(null)
  const [scale, setScale]               = useState(1)
  const [scaledHeight, setScaledHeight] = useState('auto')

  // Scale the template to fit its container on screen
  const updateScale = useCallback(() => {
    if (!containerRef.current || !innerRef.current) return
    const containerWidth = containerRef.current.offsetWidth
    const s = Math.min(1, containerWidth / NATURAL_WIDTH)
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
      {/* id="resume-preview" is the target for html2canvas in downloadPdf.js */}
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
    </div>
  )
}

export default ResumePreview
