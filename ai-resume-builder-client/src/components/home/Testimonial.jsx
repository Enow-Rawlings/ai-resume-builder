import { BookUserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Title from "./Title";
import api from "../../configs/api.js";

const defaultTestimonials = [
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@neilstellar",
    message:
      "CVPILOT made it so easy to create a professional resume. The AI suggestions were spot on, and I had a polished resume ready in no time!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
    message:
      "The guided experience helped me structure my resume clearly and confidently. The result looked amazing!",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    message:
      "I appreciated how fast the builder was. The resume formatting options made everything look polished and on-brand.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Mia Thompson",
    handle: "@miathompson",
    message:
      "Creating a resume felt less stressful with CVPILOT. It gave me real confidence going into interviews.",
  },
];

const Testimonial = () => {
  const [cardsData, setCardsData] = useState(defaultTestimonials);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/api/testimonials')
        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setCardsData(data.testimonials)
        }
      } catch (error) {
        console.warn('Failed to load testimonials', error)
      }
    }

    fetchTestimonials()
  }, []);

  const truncateMessage = (message, maxLength = 170) => {
    if (!message) return ''
    return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message
  }

  const selectTestimonial = (id) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const CreateCard = ({ card }) => {
    const testimonialId = card._id ?? card.id
    const isSelected = selectedId === testimonialId
    const displayedMessage = isSelected ? card.message : truncateMessage(card.message)

    return (
      <button
        type="button"
        onClick={() => selectTestimonial(testimonialId)}
        className={`group text-left rounded-3xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#9400D3]/40 ${
          isSelected ? 'border-[#9400D3] bg-[#F5F0FF]' : 'border-slate-200 bg-white'
        }`}
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
          {displayedMessage}
        </p>
        {!isSelected && card.message.length > 170 && (
          <span className="mt-4 inline-block text-sm font-medium text-[#9400D3]">
            Read more
          </span>
        )}
        {isSelected && (
          <span className="mt-4 inline-block text-sm text-slate-500">
            Tap again to collapse.
          </span>
        )}
      </button>
    )
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

      <div className="grid w-full gap-6 max-w-6xl pt-10 sm:grid-cols-2 xl:grid-cols-3">
        {cardsData.map((card) => (
          <CreateCard key={card._id ?? card.id} card={card} />
        ))}
      </div>

      {selectedId && (
        <div className="mt-10 w-full max-w-6xl rounded-3xl border border-[#9400D3]/20 bg-[#F8F5FF] p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#9400D3]">Featured testimonial</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {cardsData.find((card) => selectedId === (card._id ?? card.id))?.name}
              </p>
              <p className="text-sm text-slate-500">
                {cardsData.find((card) => selectedId === (card._id ?? card.id))?.handle}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              {new Date(
                cardsData.find((card) => selectedId === (card._id ?? card.id))?.createdAt || Date.now()
              ).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-6 text-slate-700 leading-relaxed">
            {cardsData.find((card) => selectedId === (card._id ?? card.id))?.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
