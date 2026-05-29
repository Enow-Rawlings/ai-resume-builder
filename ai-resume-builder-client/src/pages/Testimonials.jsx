import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookUserIcon, ArrowLeft } from 'lucide-react'
import Title from '../components/home/Title'
import api from '../configs/api.js'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const isValidTestimonial = (testimonial) => {
    return (
      testimonial &&
      testimonial.name?.trim() &&
      testimonial.handle?.trim() &&
      testimonial.message?.trim() &&
      testimonial.userId
    )
  }

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/api/testimonials')
        if (Array.isArray(data.testimonials)) {
          const validTestimonials = data.testimonials.filter(isValidTestimonial)
          setTestimonials(validTestimonials)
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#9400D3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-[#9400D3]">
            <BookUserIcon className="h-5 w-5" />
            <span>Testimonials</span>
          </div>
          <Title
            title="Read genuine feedback from every user"
            description="Explore all submitted testimonials, learn how people are using CVPILOT, and see real user experiences in one place."
          />

          {isLoading ? (
            <p className="mt-8 text-sm text-slate-500">Loading testimonials...</p>
          ) : !testimonials.length ? (
            <div className="mt-12 rounded-3xl bg-[#F8F5FF] p-8 text-center text-slate-700 shadow-sm">
              <p className="text-xl font-semibold">No testimonials available yet.</p>
              <p className="mt-2 text-sm text-slate-500">
                Once a user submits a review from their dashboard, it will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((card) => (
                <div key={card._id} className="rounded-3xl border border-slate-200 bg-[#F8F5FF] p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-14 w-14 rounded-full object-cover"
                      src={card.image}
                      alt={`${card.name} profile`}
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{card.name}</p>
                      <p className="text-xs text-slate-500">{card.handle}</p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-slate-700">{card.message}</p>
                  <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                    <span>{card.name ? 'Verified user' : 'Anonymous'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Testimonials
