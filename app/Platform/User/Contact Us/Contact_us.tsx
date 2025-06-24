import React, { useState } from 'react';
import Informations from "~/Common/Informations/Informations";
import axios from "axios";
import { toast } from 'react-toastify';

type FormFields = 'name' | 'email' | 'message';

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = {
  [key in FormFields]: string;
};

type FloatingInputProps = {
  label: string;
  id: FormFields;
  type?: string;
  isTextarea?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
};

const FloatingInput: React.FC<FloatingInputProps> = ({ label, id, type = 'text', isTextarea = false, value, onChange, error }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1 ${
          isActive ? "-top-3 text-xs text-blue-600" : "top-2.5 text-gray-500"
        }`}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3 pt-5 pb-2 border rounded-md focus:outline-none focus:ring-2 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full px-3 pt-5 pb-2 border rounded-md focus:outline-none focus:ring-2 ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function Contact_Us() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (['name', 'email', 'message'].includes(id)) {
      const field = id as FormFields;
      setFormData(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors: FormErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) { newErrors.name = 'Name is required'; hasError = true; }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; hasError = true; }
    if (!formData.message.trim()) { newErrors.message = 'Message is required'; hasError = true; }

    setErrors(newErrors);

    if (hasError) {
      toast.warning('Please fill all required fields.');
      return;
    }

    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="min-h-dvh">
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs text-center">
        Contact Us
      </div>
      <div className="flex flex-col md:flex-row m-4 items-center justify-around gap-6">
        <div className="flex-1 w-full flex flex-col gap-3 items-start justify-baseline font-semibold tracking-wider text-lg">
          <p className="text-sm md:text-lg">
            &emsp;Manipur Institute of Technology<br />
            &emsp;(A Constituent College of Manipur University)<br />
            &emsp;Takyelpat, Imphal - 795001, Manipur , India
          </p>
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              height: 0,
              paddingBottom: "75%",
              position: "relative",
              margin: "0 auto",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d771.0319076983468!2d93.90538353858935!3d24.798544329133495!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3749288213100001%3A0x4aab7b12460d98b8!2sMIT%20Main%20Block!5e1!3m2!1sen!2sin!4v1744118204792!5m2!1sen!2sin"
              style={{
                border: "1px solid gray",
                borderRadius: "8px",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 max-w-lg w-full p-6 border-2 border-gray-300 rounded-xl bg-white shadow-md flex flex-col gap-6"
        >
          <FloatingInput
            label="Your Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <FloatingInput
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FloatingInput
            label="Message"
            id="message"
            isTextarea
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
          />
          <button
            type="submit"
            className="self-start mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
      <Informations />
    </div>
  );
}
