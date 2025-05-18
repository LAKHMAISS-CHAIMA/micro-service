import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_y1om3gn',
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_hwzyx1n',
        form.current,
        {
          publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'Yoc2p0wvSIIDPrp7D',
        }
      )
      .then(
        () => {
          console.log('SUCCESS!');
          setSubmitStatus('success');
          form.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          setSubmitStatus('error');
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Contact Us</h2>
      
      <label className="block mb-2">Name</label>
      <input className="w-full mb-4 p-2 border rounded" type="text" name="name" required />
      
      <label className="block mb-2">Email</label>
      <input className="w-full mb-4 p-2 border rounded" type="email" name="email" required />
      
      <label className="block mb-2">Message</label>
      <textarea className="w-full mb-4 p-2 border rounded" name="message" required />
      
      <button 
        className={`w-full px-4 py-2 rounded text-white ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 cursor-pointer'
        }`}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>

      {submitStatus === 'success' && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Message sent successfully!
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          Failed to send message. Please try again.
        </div>
      )}
    </form>
  );
};

export default ContactUs;