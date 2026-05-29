import { BookUserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "./Title";
import api from "../../configs/api.js";

const Testimonial = () => {
  const [cardsData, setCardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          const validTestimonials = data.testimonials.filter(isValidTestimonial)
          if (validTestimonials.length > 0) {
            setCardsData(validTestimonials)
          }
        }
      } catch (error) {
        console.warn('Failed to load testimonials', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, []);

  const firstFourTestimonials = cardsData.slice(0, 4)

  const CreateCard = ({ card }) => (
    <button
      type="button"
      onClick={() => navigate('/testimonials')}
      className="group text-left rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#9400D3]/40"
    >
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
      <p className="mt-5 text-sm leading-relaxed text-slate-700">
        {card.message}
      </p>
      <span className="mt-4 inline-block text-sm font-medium text-[#9400D3]">
        Read more
      </span>
    </button>
  )

  if (isLoading) {
    return null;
  }

  if (!cardsData.length) {
    return null;
  }

  return (
    <div
      id="testimonial"
      className="flex flex-col items-center mt-28 mb-20 scroll-mt-12 lg:mt-32"
    >
      <div className="flex items-center gap-2 text-sm text-[#9400D3] bg-[#D3D3FF]/30 border border-[#9400D3]/20 rounded-full px-6 py-1.5">
        <BookUserIcon className="size-4.5 text-[#9400D3]" />
        <span>Testimonials</span>
      </div>
      <Title
        title="Don't just take our words"
        description="Our streamlined process makes it easy to create a professional resume in just a few steps with intelligent AI-powered tools and features."
      />

      <div className="grid w-full gap-6 max-w-6xl pt-10 sm:grid-cols-2 xl:grid-cols-4">
        {firstFourTestimonials.map((card) => (
          <CreateCard key={card._id ?? card.id} card={card} />
        ))}
      </div>

      {cardsData.length > 4 && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate('/testimonials')}
            className="rounded-full bg-[#9400D3] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
          >
            See all testimonials
          </button>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
