import mongoose from 'mongoose'

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title:  { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template:     { type: String, default: "classic" },
    accent_color: { type: String, default: "#3B82F6" },

    // Controls the order sections appear in the template output.
    // Each entry is a section key matching the data fields below.
    section_order: {
        type: [String],
        default: [
            'professional_summary',
            'experience',
            'education',
            'project',
            'skills',
            'languages',
            'professional_bodies',
            'references',
        ],
    },

    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],

    // Categorized skills — Array<{ name: string, skills: string[] }>
    // Each entry is a user-defined category (e.g. "Frontend", "Clinical Skills").
    // Schema uses Mixed so the array-of-objects shape persists correctly in MongoDB.
    // The flat `skills` array above is always kept in sync as a merged union of all
    // category skills so older code paths continue to work.
    skills_categorized: { type: mongoose.Schema.Types.Mixed, default: [] },

    personal_info: {
        image:        { type: String, default: '' },
        full_name:    { type: String, default: '' },
        profession:   { type: String, default: '' },
        email:        { type: String, default: '' },
        phone:        { type: String, default: '' },
        location:     { type: String, default: '' },
        linkedin:     { type: String, default: '' },
        website:      { type: String, default: '' },
        date_of_birth:{ type: String, default: '' },
        nationality:  { type: String, default: '' },
        social_media: [{
            platform: { type: String, default: '' },
            url:      { type: String, default: '' },
        }],
    },

    experience: [{
        company:     { type: String, default: '' },
        position:    { type: String, default: '' },
        start_date:  { type: String, default: '' },
        end_date:    { type: String, default: '' },
        description: { type: String, default: '' },
        is_current:  { type: Boolean, default: false },
    }],

    project: [{
        name:        { type: String, default: '' },
        type:        { type: String, default: '' },
        description: { type: String, default: '' },
    }],

    education: [{
        institution:      { type: String, default: '' },
        degree:           { type: String, default: '' },
        field:            { type: String, default: '' },
        graduation_date:  { type: String, default: '' },
        gpa:              { type: String, default: '' },
    }],

    languages: [{
        language:    { type: String, default: '' },
        proficiency: { type: String, default: '' }, // Native | Fluent | Advanced | Intermediate | Basic
    }],

    references: [{
        name:         { type: String, default: '' },
        title:        { type: String, default: '' },
        company:      { type: String, default: '' },
        email:        { type: String, default: '' },
        phone:        { type: String, default: '' },
        relationship: { type: String, default: '' },
    }],

    professional_bodies: [{
        organization:    { type: String, default: '' },
        membership_type: { type: String, default: '' },
        year_joined:     { type: String, default: '' },
    }],

}, { timestamps: true, minimize: false })

const Resume = mongoose.model('Resume', ResumeSchema)

export default Resume
