'use client';

import React, { useState, useEffect } from 'react';
import ProFooter from '@/components/ProFooter';
import { API_ENDPOINTS } from '@/constants/api';
import { CAREER_FORM, CAREER_FORM_VALIDATION } from '@/constants/gujaratiStrings';

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  post: string;
  experience: string;
  message: string;
  cv: File | null;
}

interface FormErrors {
  fullname?: string;
  email?: string;
  phone?: string;
  post?: string;
  experience?: string;
  message?: string;
  cv?: string;
}

export default function CareerPage() {
  const [formData, setFormData] = useState<FormData>({
    fullname: '',
    email: '',
    phone: '',
    post: '',
    experience: '',
    message: '',
    cv: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [applyPosts, setApplyPosts] = useState<string[]>([]);

  // Add mounted state to track component lifecycle
  useEffect(() => {
    console.log('🚀 CareerPage component mounted');
    return () => {
      console.log('💀 CareerPage component unmounted');
    };
  }, []);

  // Fetch apply posts from category settings
  useEffect(() => {
    const fetchApplyPosts = async () => {
      try {
        console.log('🔍 Fetching apply posts from API...');
        const response = await fetch(API_ENDPOINTS.CATEGORY_SETTING, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('❌ API Response not OK:', response.status, response.statusText);
          return;
        }

        const data = await response.json();

        if (data.setting && data.setting.length > 0) {
          const settings = data.setting[0];


          if (settings.applypost) {
            // Handle both string and array formats
            let posts: string[] = [];

            if (typeof settings.applypost === 'string') {
              // Split by comma and trim each post
              posts = settings.applypost
                .split(',')
                .map((post: string) => post.trim())
                .filter((post: string) => post.length > 0);
            } else if (Array.isArray(settings.applypost)) {
              posts = settings.applypost;
            }


            setApplyPosts(posts);
          }
        } else {
          console.warn('⚠️ Invalid API response structure');
          console.warn('⚠️ Response data:', data);
        }
      } catch (error) {
        console.error('❌ Error fetching apply posts:', error);
      }
    };

    fetchApplyPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      cv: file
    }));
    // Clear error for this field
    if (errors.cv) {
      setErrors(prev => ({
        ...prev,
        cv: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = CAREER_FORM_VALIDATION.ENTER_FULLNAME;
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = 'Full name must be at least 3 characters.';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = CAREER_FORM_VALIDATION.ENTER_EMAIL;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = CAREER_FORM_VALIDATION.ENTER_PHONE;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }

    // Post validation
    if (!formData.post) {
      newErrors.post = CAREER_FORM_VALIDATION.SELECT_POST;
    }

    // Experience validation
    if (!formData.experience.trim()) {
      newErrors.experience = CAREER_FORM_VALIDATION.ENTER_EXPERIENCE;
    } else if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      newErrors.experience = CAREER_FORM_VALIDATION.VALID_EXPERIENCE;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = CAREER_FORM_VALIDATION.ENTER_MESSAGE;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = CAREER_FORM_VALIDATION.MESSAGE_MIN_LENGTH;
    } else if (formData.message.trim().length > 500) {
      newErrors.message = CAREER_FORM_VALIDATION.MESSAGE_MAX_LENGTH;
    }

    // CV validation
    if (!formData.cv) {
      newErrors.cv = CAREER_FORM_VALIDATION.UPLOAD_CV;
    } else {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = formData.cv.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        newErrors.cv = CAREER_FORM_VALIDATION.CV_FORMAT_ERROR;
      } else if (formData.cv.size > 5000000) {
        newErrors.cv = CAREER_FORM_VALIDATION.CV_SIZE_ERROR;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hideMessageAfterTimeout = (setter: React.Dispatch<React.SetStateAction<string>>, timeout = 3000) => {
    setTimeout(() => {
      setter('');
    }, timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitMessage('');
    setErrorMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('fullname', formData.fullname);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('post', formData.post);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('message', formData.message);
    if (formData.cv) {
      formDataToSend.append('cv', formData.cv);
    }

    try {
      const response = await fetch(API_ENDPOINTS.CAREER_SUBMIT, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage(data.message || 'Application submitted successfully!');
        // Reset form
        setFormData({
          fullname: '',
          email: '',
          phone: '',
          post: '',
          experience: '',
          message: '',
          cv: null,
        });
        // Reset file input
        const fileInput = document.getElementById('cv-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        hideMessageAfterTimeout(setSubmitMessage);
      } else {
        setErrorMessage(data.message || CAREER_FORM_VALIDATION.SUBMIT_ERROR);
        hideMessageAfterTimeout(setErrorMessage);
      }
    } catch (error) {
      console.error(CAREER_FORM_VALIDATION.CAREER_FORM_ERROR, error);
      setErrorMessage(CAREER_FORM_VALIDATION.ERROR_OCCURRED);
      hideMessageAfterTimeout(setErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <div className="justify-content-center">
          <div className="">
            <div className="profilePage">
              <form className="formBox" id="career-form" encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="pNewsBox">
                  <div className="title">
                    <h2>{CAREER_FORM.TITLE}</h2>
                  </div>


                  <div className="pnewsContent">
                    {/* Submit Message */}
                    {submitMessage && (
                      <div className="text-success mt-2 mb-3 text-center" style={{ fontWeight: 'bold' }}>
                        {submitMessage}
                      </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                      <div className="text-danger mt-2 mb-3 text-center" style={{ fontWeight: 'bold' }}>
                        {errorMessage}
                      </div>
                    )}

                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <div className="lable">{CAREER_FORM.FULLNAME_LABEL}</div>
                        <div className="inputOuter">
                          <input
                            type="text"
                            name="fullname"
                            className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                            placeholder={CAREER_FORM.FULLNAME_PLACEHOLDER}
                            value={formData.fullname}
                            onChange={handleInputChange}
                          />
                          {errors.fullname && (
                            <span className="invalid-feedback">{errors.fullname}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-6 mb-4">
                        <div className="lable">{CAREER_FORM.EMAIL_LABEL}</div>
                        <div className="inputOuter">
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder={CAREER_FORM.EMAIL_PLACEHOLDER}
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          {errors.email && (
                            <span className="invalid-feedback">{errors.email}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <div className="lable">{CAREER_FORM.PHONE_LABEL}</div>
                        <div className="inputOuter">
                          <input
                            type="text"
                            name="phone"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            placeholder={CAREER_FORM_VALIDATION.PHONE_PLACEHOLDER}
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                          {errors.phone && (
                            <span className="invalid-feedback">{errors.phone}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-6 mb-4">
                        <div className="lable">{CAREER_FORM.POST_LABEL}</div>
                        <div className="inputOuter">
                          <select
                            name="post"
                            className={`form-control ${errors.post ? 'is-invalid' : ''}`}
                            value={formData.post}
                            onChange={handleInputChange}
                          >
                            <option value="">
                              {applyPosts.length === 0 ? CAREER_FORM_VALIDATION.LOADING_POSTS : CAREER_FORM_VALIDATION.SELECT_POST_PLACEHOLDER}
                            </option>
                            {applyPosts.length > 0 ? (
                              applyPosts.map((post, index) => (
                                <option key={index} value={post}>
                                  {post}
                                </option>
                              ))
                            ) : null}
                          </select>
                          {errors.post && (
                            <span className="invalid-feedback">{errors.post}</span>
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <div className="lable">{CAREER_FORM.EXPERIENCE_LABEL}</div>
                        <div className="inputOuter">
                          <input
                            type="text"
                            name="experience"
                            className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                            placeholder={CAREER_FORM.EXPERIENCE_PLACEHOLDER}
                            value={formData.experience}
                            onChange={handleInputChange}
                          />
                          {errors.experience && (
                            <span className="invalid-feedback">{errors.experience}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 mb-4">
                        <div className="lable">{CAREER_FORM.MESSAGE_LABEL}</div>
                        <div className="inputOuter">
                          <textarea
                            name="message"
                            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                            rows={4}
                            placeholder={CAREER_FORM.MESSAGE_PLACEHOLDER}
                            value={formData.message}
                            onChange={handleInputChange}
                          />
                          {errors.message && (
                            <span className="invalid-feedback">{errors.message}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 mb-4">
                        <div className="lable">{CAREER_FORM.CV_LABEL}</div>
                        <div className="inputOuter">
                          <input
                            type="file"
                            id="cv-input"
                            name="cv"
                            className={`form-control ${errors.cv ? 'is-invalid' : ''}`}
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                          {errors.cv && (
                            <span className="invalid-feedback">{errors.cv}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {loading && (
                      <div className="text-center position-relative">
                        <div style={{ marginBottom: '10px', color: '#ff0000', fontWeight: 'bold' }}>
                          <img src="/assets/images/loading.gif" alt={CAREER_FORM_VALIDATION.LOADING_IMAGE_ALT} style={{ width: '30px', verticalAlign: 'middle' }} />
                        </div>
                      </div>
                    )}

                  <div className="profileBtn">
                    <button type="submit" className="btn-gstv" disabled={loading}>
                      {loading ? CAREER_FORM_VALIDATION.SUBMITTING : CAREER_FORM_VALIDATION.SUBMIT}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
   
    </>
  );
}
