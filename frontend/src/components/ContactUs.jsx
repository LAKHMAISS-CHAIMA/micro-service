import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_y1om3gn', 'template_hwzyx1n', form.current, {
        publicKey: 'Yoc2p0wvSIIDPrp7D',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert('Message sent successfully!');
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert('Failed to send message.');
        }
      );
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
      <input className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 cursor-pointer" type="submit" value="Send" />
    </form>
  );
};

export default ContactUs;
