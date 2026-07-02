'use client';

import React, { useState, useEffect } from 'react';
import ProFooter from '@/components/ProFooter';
import { useLanguage } from '@/contexts/LanguageContext';
import { API_ENDPOINTS } from '@/constants/api';

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
  const { t } = useLanguage();
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
      newErrors.fullname = t('FULLNAME_ERROR');
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = t('FULLNAME_MIN_LENGTH_ERROR');
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('EMAIL_ERROR');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('EMAIL_INVALID_ERROR');
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t('PHONE_ERROR');
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t('PHONE_INVALID_ERROR');
    }

    // Post validation
    if (!formData.post) {
      newErrors.post = t('POST_ERROR');
    }

    // Experience validation
    if (!formData.experience.trim()) {
      newErrors.experience = t('EXPERIENCE_ERROR');
    } else if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      newErrors.experience = t('EXPERIENCE_INVALID_ERROR');
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t('MESSAGE_ERROR');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('MESSAGE_MIN_LENGTH_ERROR');
    } else if (formData.message.trim().length > 500) {
      newErrors.message = t('MESSAGE_MAX_LENGTH_ERROR');
    }

    // CV validation
    if (!formData.cv) {
      newErrors.cv = t('CV_ERROR');
    } else {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = formData.cv.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        newErrors.cv = t('CV_FILE_TYPE_ERROR');
      } else if (formData.cv.size > 5000000) {
        newErrors.cv = t('CV_FILE_SIZE_ERROR');
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
        setSubmitMessage(data.message || t('CAREER_SUBMIT_SUCCESS'));
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
        setErrorMessage(data.message || t('CAREER_SUBMIT_FAILED'));
        hideMessageAfterTimeout(setErrorMessage);
      }
    } catch (error) {
      console.error('Career form submission error:', error);
      setErrorMessage(t('CAREER_ERROR'));
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
                    <h2>{t('CAREER_PAGE_TITLE')}</h2>
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
                        <div className="lable">{t('FULLNAME_LABEL')}</div>
                        <div className="inputOuter">
                          <input
                            type="text"
                            name="fullname"
                            className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                            placeholder={t('FULLNAME_PLACEHOLDER')}
                            value={formData.fullname}
                            onChange={handleInputChange}
                          />
                          {errors.fullname && (
                            <span className="invalid-feedback">{errors.fullname}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-6 mb-4">
                        <div className="lable">{t('EMAIL_LABEL')}</div>
                        <div className="inputOuter">
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder={t('EMAIL_PLACEHOLDER')}
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
                        <div className="lable">{t('PHONE_LABEL')}</div>
                        <div className="inputOuter">
                          <input
                            type="text"
                            name="phone"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            placeholder={t('PHONE_PLACEHOLDER')}
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                          {errors.phone && (
                            <span className="invalid-feedback">{errors.phone}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-6 mb-4">
                        <div className="lable">{t('POST_LABEL')}</div>
                        <div className="inputOuter">
                          <select
                            name="post"
                            className={`form-control ${errors.post ? 'is-invalid' : ''}`}
                            value={formData.post}
                            onChange={handleInputChange}
                          >
                            <option value="">
                              {applyPosts.length === 0 ? t('POST_LOADING') : t('POST_SELECT')}
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
                        <div className="lable">{t('EXPERIENCE_LABEL')}</div>
                        <div className="inputOuter">
                          <input
                            type="text"
                            name="experience"
                            className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                            placeholder={t('EXPERIENCE_PLACEHOLDER')}
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
                        <div className="lable">{t('MESSAGE_LABEL')}</div>
                        <div className="inputOuter">
                          <textarea
                            name="message"
                            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                            rows={4}
                            placeholder={t('MESSAGE_PLACEHOLDER')}
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
                        <div className="lable">{t('CV_LABEL')}</div>
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
                          <img src="/assets/images/loading.gif" alt={t('LOADING')} style={{ width: '30px', verticalAlign: 'middle' }} />
                        </div>
                      </div>
                    )}

                  <div className="profileBtn">
                    <button type="submit" className="btn-gstv" disabled={loading}>
                      {loading ? t('SUBMITTING_BUTTON') : t('SUBMIT_BUTTON')}
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
