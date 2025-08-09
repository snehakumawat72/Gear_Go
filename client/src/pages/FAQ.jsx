import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqCategories = [
    {
      category: "General",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      questions: [
        {
          question: "What is GearGo?",
          answer: "GearGo is a comprehensive rental platform that allows you to rent cars and outdoor gear for your travel and adventure needs. We connect travelers with vehicle owners and gear providers to make your trips more convenient and affordable."
        },
        {
          question: "How does GearGo work?",
          answer: "Simply browse our selection of cars and gear, select your preferred items, choose your rental dates, and complete the booking with secure payment. Our owners will coordinate pickup/delivery details with you directly."
        },
        {
          question: "Do I need to create an account to rent?",
          answer: "Yes, creating an account is required for all rentals. This helps us verify users, maintain booking history, and provide better customer service. Registration is quick and free."
        }
      ]
    },
    {
      category: "Car Rentals",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      questions: [
        {
          question: "What do I need to rent a car?",
          answer: "You need a valid driver's license, credit card, and must meet the minimum age requirement (usually 21+). Some luxury or specialty vehicles may have additional requirements."
        },
        {
          question: "What's included in the car rental?",
          answer: "Basic insurance, 24/7 roadside assistance, and standard maintenance are typically included. Fuel, tolls, and any additional insurance coverage are usually extra."
        },
        {
          question: "Can I cancel or modify my car rental?",
          answer: "Yes, you can cancel or modify your booking up to 24 hours before the rental period begins. Cancellation policies may vary by owner, so check the specific terms when booking."
        }
      ]
    },
    {
      category: "Gear Rentals",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      questions: [
        {
          question: "What types of gear can I rent?",
          answer: "We offer a wide range of outdoor gear including camping equipment (tents, sleeping bags, camp stoves), hiking gear (backpacks, boots), water sports equipment, and seasonal gear like ski equipment."
        },
        {
          question: "How do I know the gear is clean and safe?",
          answer: "All gear is thoroughly cleaned and inspected between rentals. Our gear providers follow strict hygiene and safety protocols. We also maintain detailed maintenance records for all equipment."
        },
        {
          question: "What if the gear is damaged during my rental?",
          answer: "Minor wear and tear is expected and covered. For significant damage, you may be charged for repairs or replacement. We recommend purchasing our damage protection coverage for peace of mind."
        }
      ]
    },
    {
      category: "Booking & Payment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      questions: [
        {
          question: "How do I make a booking?",
          answer: "Browse our inventory, select your desired item, choose dates, review pricing, and complete payment through our secure checkout process. You'll receive confirmation via email."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure Razorpay integration. Payment is processed securely with bank-level encryption."
        },
        {
          question: "Can I get a refund?",
          answer: "Refund policies vary by item and timing. Generally, cancellations made 24+ hours in advance are eligible for full refunds minus processing fees. Check individual listing policies for details."
        }
      ]
    },
    {
      category: "For Owners",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      questions: [
        {
          question: "How do I list my car or gear?",
          answer: "Create an owner account, provide verification documents, upload high-quality photos, set your pricing and availability, and submit for approval. Our team will review and activate your listing."
        },
        {
          question: "How much can I earn?",
          answer: "Earnings vary based on location, demand, and asset type. Cars can earn $50-300+ per day, while gear typically earns $10-50+ per day. Our calculator can provide estimates based on your specific items."
        },
        {
          question: "When do I get paid?",
          answer: "Payments are processed 24 hours after successful rental completion and transferred to your bank account within 2-3 business days."
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: "Start Renting",
      description: "Browse our cars and gear",
      link: "/cars",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "List Your Items",
      description: "Become an owner and earn",
      link: "/owner",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      link: "/contact",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.528L3 21l3.528-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        // url('https://images.pexels.com/photos/1887995/pexels-photo-1887995.jpeg')
        style={{
          // backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.2)),
          backgroundImage: `url('https://concisemedico.co.uk/wp-content/uploads/2023/07/FAQ-Background.webp')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              FAQ
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Frequently Asked Questions
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                to={action.link}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-lg mb-4">
                  {action.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </Link>
            ))}
          </motion.div>

          {/* FAQ Categories */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-dull text-white p-6">
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <h2 className="text-2xl font-bold">{category.category}</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex; // Unique index for each FAQ
                      const isOpen = openFAQ === globalIndex;
                      
                      return (
                        <div key={faqIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full text-left p-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                {faq.question}
                              </h3>
                              <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0"
                              >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </motion.div>
                            </div>
                          </button>
                          
                          <motion.div
                            initial={false}
                            animate={{
                              height: isOpen ? "auto" : 0,
                              opacity: isOpen ? 1 : 0
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 border-t border-gray-100">
                              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Still Have Questions Section */}
          <motion.div 
            className="mt-16 bg-gradient-to-r from-primary to-primary-dull rounded-2xl text-white p-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="bg-white text-primary font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.528L3 21l3.528-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
                Contact Support
              </Link>
              <a 
                href="mailto:support@geargo.com"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary transition-colors duration-200 inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
