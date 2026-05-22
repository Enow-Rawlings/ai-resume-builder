import React, { useState } from 'react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const handleSubscribe = (event) => {
    event.preventDefault()
    if (!email) {
      setStatus('Please enter a valid email address.')
      return
    }
    setStatus('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <div>
        <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
            
                * {
                    font-family: "Poppins", sans-serif;
                }
            `}</style>
            <footer className='bg-gradient-to-r from-[#9400D3] via-[#7A3FD7] to-[#D3D3FF] py-10 px-5 sm:px-6 lg:px-10 mt-16'>
                <div className='w-full max-w-7xl mx-auto'>

                    <div className="flex flex-wrap justify-between gap-y-8 lg:gap-x-8">

                        <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-center md:items-start text-center md:text-left">
                            <a href="/" className="inline-flex items-center gap-3">
                                <div className="w-12 h-12 rounded-3xl bg-white/15 flex items-center justify-center text-white text-lg font-semibold">CV</div>
                                <span className="text-xl font-semibold text-white">CVPILOT</span>
                            </a>
                            <div className='w-full max-w-52 h-px mt-6 bg-white/20'></div>
                            <p className='text-base text-white/80 mt-4 max-w-md leading-relaxed'>
                                CVPILOT helps professionals build polished, interview-ready resumes faster with AI guidance, smart formatting, and role-specific content suggestions.
                            </p>
                        </div>

                        <div className="w-full md:w-[45%] lg:w-[16%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-white font-semibold'>Explore</h3>
                            <div className="flex flex-col gap-3 mt-4">
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>Resume Builder</a>
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>Templates</a>
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>Editor</a>
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>Guides</a>
                            </div>
                        </div>

                        <div className="w-full md:w-[45%] lg:w-[16%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-white font-semibold'>Company</h3>
                            <div className="flex flex-col gap-3 mt-4">
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>About</a>
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>Support</a>
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>Blog</a>
                                <a href="#" className='text-sm text-white/75 hover:text-white transition-colors'>Contact</a>
                            </div>
                        </div>

                        <div className="w-full md:w-[45%] lg:w-[27%] flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className='text-white font-semibold'>Stay updated</h3>
                            <form onSubmit={handleSubscribe} className="mt-5 w-full max-w-md">
                                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                                <div className="flex items-center gap-2 bg-transparent border border-transparent h-12 w-full rounded-full overflow-hidden px-3">
                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full h-full bg-transparent border-none text-sm text-white placeholder:text-white/60 outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                                        required
                                    />
                                    <button type="submit" className="bg-[#9400D3] hover:bg-[#7A3FD7] transition-all text-white text-sm font-medium rounded-full px-4 py-2">Subscribe</button>
                                </div>
                                {status && (
                                    <p className="mt-3 text-sm text-white/80">{status}</p>
                                )}
                            </form>
                        </div>

                    </div>

                    <div className='w-full h-px mt-10 mb-4 bg-white/20'></div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                        <p className='text-xs text-white/70'>© 2026 CVPILOT. All rights reserved.</p>
                        <div className="flex items-center gap-6 justify-center md:justify-end">
                            <a href='#' className='text-xs text-white/70 hover:text-white transition-colors'>Terms</a>
                            <div className='w-px h-4 bg-white/20'></div>
                            <a href='#' className='text-xs text-white/70 hover:text-white transition-colors'>Privacy</a>
                        </div>
                    </div>
                </div>
            </footer>
    </div>
  )
}

export default Footer