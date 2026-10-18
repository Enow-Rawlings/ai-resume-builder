// import React from 'react'
// import { ModuleRunner } from 'vite/module-runner'

// import ClassicTemplate from './templates/ClassicTemplate'
// import ModernTemplate from './templates/ModernTemplate'
// import MinimalTemplate from './templates/MinimalTemplate'
// import MinimalImageTemplate from './templates/MinimalImageTemplate'

// const ResumePreview = ({data, template, accentColor, classes = ""}) =>{

//     const renderTemplate = ()=>{
//         switch (template) {
//             case 'modern':
//                 return <ModernTemplate data={data} accentColor={accentColor}/>
//             case 'minimal':
//                 return <MinimalTemplate data={data} accentColor={accentColor}/>
//             case 'minimal-image':
//                 return <MinimalImageTemplate data={data} accentColor={accentColor}/>

//             default: 
//                 return <ClassicTemplate data={data} accentColor={accentColor}/>
//         }
//     }
//     return (
//         <div className='w-full bg-gray-100'>
//             <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none" + classes}>
//             {renderTemplate()}
//             </div>

//             <style jsx>
//                 {`
//                 @page {
//                 size: letter;
//                 margin: 0
//                 }
//                 @media print {
//                 html, body {
//                 width: 8.5in;
//                 height: 11in;
//                 overflow: hidden;
//                 }
//                 body * {
//                 visibility: hidden; 
//                 }
//                 #resume-preview, #resume-preview * {
//                 visibility: visible;
//                 }
//                 #resume-preview {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 height: auto;
//                 margin: 0;
//                 padding: 0;
//                 box-shadow: none !important;
//                 border: none !important;
//                 }
//                 }
//                 `}
//             </style>

//         </div>
//     )
// }

// export default ResumePreview

import React, { useRef, useEffect, useState } from 'react'

import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'
import TechTemplate from './templates/TechTemplate'
import CreativeTemplate from './templates/CreativeTemplate'

const TEMPLATE_NATURAL_WIDTH = 896 // max-w-4xl = 56rem = 896px

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {
  const containerRef = useRef(null)
  const innerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [scaledHeight, setScaledHeight] = useState('auto')

  useEffect(() => {
    const update = () => {
      if (!containerRef.current || !innerRef.current) return
      const containerWidth = containerRef.current.offsetWidth
      const newScale = Math.min(1, containerWidth / TEMPLATE_NATURAL_WIDTH)
      const innerHeight = innerRef.current.scrollHeight
      // The outer container must be exactly (innerHeight * scale) tall
      // so there's no gap below the scaled content
      setScale(newScale)
      setScaledHeight(innerHeight * newScale)
    }

    update()

    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    if (innerRef.current) ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [data, template]) // re-measure when content changes

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
    // Outer container — its height is set to exactly the scaled content height
    <div
      ref={containerRef}
      className={'w-full overflow-hidden ' + classes}
      style={{ height: scaledHeight }}
    >
      {/* Inner div — natural width, scaled down from top-left */}
      <div
        ref={innerRef}
        id="resume-preview"
        className="origin-top-left bg-white print:shadow-none print:border-none"
        style={{
          width: `${TEMPLATE_NATURAL_WIDTH}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {renderTemplate()}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @page { size: letter; margin: 0; }
        @media print {
          html, body { width: 8.5in; height: 11in; overflow: hidden; }
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview {
            position: absolute; left: 0; top: 0;
            width: 100%; height: auto; margin: 0; padding: 0;
            box-shadow: none !important; border: none !important;
            transform: none !important;
          }
          #resume-preview, #resume-preview * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #resume-preview header {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: inherit !important;
            color: inherit !important;
          }
          .print-svg { display: none !important; }
          @media print { .print-svg { display: block !important; } }
        }
      `}} />
    </div>
  )
}

export default ResumePreview
