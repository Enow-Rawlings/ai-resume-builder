

import fs from 'fs'
import Resume from "../models/Resume.js"
import imagekit from "../configs/imageKit.js"

// POST: /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const {title, content} = req.body
        const userId = req.userId

        const newResume = await Resume.create({userId, title, content})
        return res.status(201).json({message: 'Resume created successfully', resume: newResume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
    try {
        const {resumeId} = req.params
        const userId = req.userId 

        await Resume.findOneAndDelete({_id: resumeId, userId})
        return res.status(200).json({message: 'Resume deleted successfully'})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
    try {
        const {resumeId} = req.params
        const userId = req.userId

        const resume = await Resume.findOne({_id: resumeId, userId})
        if (!resume) {
            return res.status(404).json({message: 'Resume not found'})
        }
        resume.__v = undefined
        resume.createdAt = undefined
        resume.updatedAt = undefined

        return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
    try {
        const {resumeId} = req.params;
        const resume = await Resume.findOne({_id: resumeId, public: true})
        if (!resume) {
            return res.status(404).json({message: 'Resume not found'})
        }
        return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// PUT: /api/resumes/update
// PUT: /api/resumes/update
// PUT: /api/resumes/update
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;
        const userId = req.userId;

        if (!resumeId) {
            return res.status(400).json({ message: "Missing resumeId parameter in request" });
        }

        let resumeDataCopy;
        if (typeof resumeData === 'string') {
            resumeDataCopy = JSON.parse(resumeData);
        } else {
            resumeDataCopy = structuredClone(resumeData);
        }

        // Initialize personal_info object if it doesn't exist
        resumeDataCopy.personal_info = resumeDataCopy.personal_info || {};

        // =========================================================================
        // CASE A: User uploaded a BRAND NEW image file via Multer
        // =========================================================================
        if (image) {
            const imageSource = fs.createReadStream(image.path);
            
            // Build the upload transformation parameters dynamically
            const preTransformation = 'w-300,h-300,fo-face,z-0.75' + (removeBackground === 'yes' ? ',e-bgremove' : '');

            const response = await imagekit.files.upload({
                file: imageSource,
                fileName: image.originalname,
                folder: 'user-resumes',
                useUniqueFileName: true,
                transformation: {
                    pre: preTransformation
                }
            });
            
            resumeDataCopy.personal_info.image = response.url;
            
            // Clean up the temporary local file stored by Multer on your server
            if (fs.existsSync(image.path)) {
                fs.unlinkSync(image.path);
            }
        } 
        // =========================================================================
        // CASE B: Toggling background removal for an EXISTING ImageKit image URL string
        // =========================================================================
        else if (resumeDataCopy.personal_info.image && typeof resumeDataCopy.personal_info.image === 'string') {
            let currentUrl = resumeDataCopy.personal_info.image;

            // 1. Clean out any previous background removal parameters to prevent nesting bugs
            currentUrl = currentUrl
                .replace(/,e-bgremove/g, '')
                .replace(/tr=e-bgremove/g, '')
                .replace(/[&?]tr=e-bgremove/g, '');

            if (removeBackground === 'yes') {
                // 2. If the URL already contains transformation parameters (e.g., contains 'tr=')
                if (currentUrl.includes('tr=')) {
                    // Inject the background removal tag straight into the transformation list
                    currentUrl = currentUrl.replace(/(tr=[^&\?]+)/, '$1,e-bgremove');
                } else {
                    // 3. Otherwise append it cleanly as a URL query parameter string
                    currentUrl += currentUrl.includes('?') ? '&tr=e-bgremove' : '?tr=e-bgremove';
                }
            }

            // Guard rails to fix any duplicate formatting characters from string replacement
            currentUrl = currentUrl.replace(/\?&/g, '?').replace(/,\?/g, '?');

            resumeDataCopy.personal_info.image = currentUrl;
        }

        // =========================================================================
        // SAVE TO DATABASE
        // =========================================================================
        const resume = await Resume.findOneAndUpdate({ _id: resumeId, userId }, resumeDataCopy, { new: true });
        
        if (!resume) {
            return res.status(404).json({ message: "Resume target file not found" });
        }

        return res.status(200).json({ message: 'Resume updated successfully', resume });
    } catch (error) {
        console.error("Backend Update Error:", error);
        return res.status(400).json({ message: error.message });
    }
};
