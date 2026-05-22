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

import React from 'react'

import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({data, template, accentColor, classes = ""}) =>{

    const renderTemplate = ()=>{
        switch (template) {
            case 'modern':
                return <ModernTemplate data={data} accentColor={accentColor}/>
            case 'minimal':
                return <MinimalTemplate data={data} accentColor={accentColor}/>
            case 'minimal-image':
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>

            default: 
                return <ClassicTemplate data={data} accentColor={accentColor}/>
        }
    }
    return (
        <div className='w-full bg-gray-100'>
            <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none " + classes}>
            {renderTemplate()}
            </div>

            {/* Fixed: Standard React style tag injection with raw string to bypass attribute validation warnings */}
            <style dangerouslySetInnerHTML={{__html: `
                @page {
                  size: letter;
                  margin: 0;
                }
                @media print {
                  html, body {
                    width: 8.5in;
                    height: 11in;
                    overflow: hidden;
                  }
                  /* Ensure only the resume is visible in print */
                  body * {
                    visibility: hidden; 
                  }
                  #resume-preview, #resume-preview * {
                    visibility: visible;
                  }
                  #resume-preview {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: auto;
                    margin: 0;
                    padding: 0;
                    box-shadow: none !important;
                    border: none !important;
                  }

                  /* Force printing of colors/backgrounds where the template uses them */
                  #resume-preview, #resume-preview * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }

                  /* Ensure header backgrounds (used by some templates) are preserved */
                  #resume-preview header {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    background-color: inherit !important;
                    color: inherit !important;
                  }
                  /* Hide the inline SVG on screen, show in print to act as a printed background */
                  .print-svg { display: none !important; }
                  @media print {
                    .print-svg { display: block !important; }
                  }
                }
            `}} />
        </div>
    )
}

export default ResumePreview
