'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { supabase } from '@/lib/supabase/client'; // Commented out to avoid lint error
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaFilter, FaBookmark } from 'react-icons/fa';

interface Job {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo_url: string | null;
    location: string;
  };
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  salary_range: string | null;
  description: string;
  requirements: string[];
  posted_at: string;
  deadline: string | null;
  is_saved: boolean;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    jobType: 'all',
    location: 'all',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we will use mock data

      // Mock jobs data
      const mockJobs: Job[] = [
        {
          id: 'job1',
          title: 'Senior Frontend Developer',
          company: {
            id: 'company1',
            name: 'Tech Innovations Inc.',
            logo_url: null,
            location: 'San Francisco, CA',
          },
          location: 'San Francisco, CA',
          type: 'full-time',
          salary_range: '$120,000 - $150,000',
          description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user interfaces for our web applications using React, Next.js, and TypeScript.',
          requirements: [
            'At least 5 years of experience with JavaScript and frontend frameworks',
            'Strong knowledge of React and Next.js',
            'Experience with TypeScript',
            'Understanding of responsive design and cross-browser compatibility',
            'Good communication skills and ability to work in a team',
          ],
          posted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          is_saved: true,
        },
        {
          id: 'job2',
          title: 'Backend Engineer',
          company: {
            id: 'company2',
            name: 'DataFlow Systems',
            logo_url: null,
            location: 'Remote',
          },
          location: 'Remote',
          type: 'full-time',
          salary_range: '$110,000 - $140,000',
          description: 'We are seeking a Backend Engineer to develop and maintain our server-side applications. You will work with Node.js, Express, and PostgreSQL to build scalable and efficient APIs.',
          requirements: [
            'At least 3 years of experience with Node.js and Express',
            'Strong knowledge of SQL and PostgreSQL',
            'Experience with RESTful API design',
            'Understanding of microservices architecture',
            'Ability to write clean, maintainable code',
          ],
          posted_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          is_saved: false,
        },
        {
          id: 'job3',
          title: 'UX/UI Designer',
          company: {
            id: 'company3',
            name: 'Creative Solutions',
            logo_url: null,
            location: 'New York, NY',
          },
          location: 'New York, NY',
          type: 'full-time',
          salary_range: '$90,000 - $120,000',
          description: 'We are looking for a talented UX/UI Designer to create amazing user experiences. You will work closely with product managers and developers to design intuitive and visually appealing interfaces.',
          requirements: [
            'At least 3 years of experience in UX/UI design',
            'Proficiency in design tools such as Figma and Adobe Creative Suite',
            'Strong portfolio demonstrating your design skills',
            'Understanding of user-centered design principles',
            'Ability to create wireframes, prototypes, and high-fidelity designs',
          ],
          posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          is_saved: false,
        },
        {
          id: 'job4',
          title: 'DevOps Engineer',
          company: {
            id: 'company4',
            name: 'Cloud Systems Inc.',
            logo_url: null,
            location: 'Seattle, WA',
          },
          location: 'Seattle, WA',
          type: 'full-time',
          salary_range: '$130,000 - $160,000',
          description: 'We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You will work with AWS, Docker, and Kubernetes to ensure our systems are scalable, secure, and reliable.',
          requirements: [
            'At least 4 years of experience in DevOps or SRE roles',
            'Strong knowledge of AWS services',
            'Experience with Docker and Kubernetes',
            'Understanding of CI/CD pipelines',
            'Knowledge of infrastructure as code (Terraform, CloudFormation)',
          ],
          posted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          is_saved: true,
        },
        {
          id: 'job5',
          title: 'Product Manager',
          company: {
            id: 'company5',
            name: 'Innovate Labs',
            logo_url: null,
            location: 'Austin, TX',
          },
          location: 'Austin, TX',
          type: 'full-time',
          salary_range: '$100,000 - $130,000',
          description: 'We are looking for a Product Manager to help us define and execute our product strategy. You will work closely with designers, developers, and stakeholders to deliver products that meet user needs and business goals.',
          requirements: [
            'At least 3 years of experience in product management',
            'Strong analytical and problem-solving skills',
            'Experience with agile methodologies',
            'Excellent communication and leadership skills',
            'Ability to prioritize features and create product roadmaps',
          ],
          posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString(),
          is_saved: false,
        },
        {
          id: 'job6',
          title: 'Data Scientist',
          company: {
            id: 'company6',
            name: 'Analytics Pro',
            logo_url: null,
            location: 'Chicago, IL',
          },
          location: 'Chicago, IL',
          type: 'full-time',
          salary_range: '$115,000 - $145,000',
          description: 'We are seeking a Data Scientist to help us extract insights from our data. You will use statistical methods and machine learning techniques to solve complex business problems.',
          requirements: [
            'At least 3 years of experience in data science or related field',
            'Strong knowledge of Python and data science libraries (NumPy, Pandas, Scikit-learn)',
            'Experience with machine learning algorithms',
            'Understanding of statistical analysis',
            'Ability to communicate complex findings to non-technical stakeholders',
          ],
          posted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
          is_saved: false,
        },
      ];

      setJobs(mockJobs);
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  };

  const formatDeadline = (deadline: string | null): string => {
    if (!deadline) return 'No deadline';

    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays < 7) {
      return `${diffDays} days left`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks left`;
    } else {
      return `${Math.floor(diffDays / 30)} months left`;
    }
  };

  const handleSaveJob = (jobId: string) => {
    // In a real app, we would update the saved status in Supabase
    // For now, we will just update the local state
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId
          ? { ...job, is_saved: !job.is_saved }
          : job
      )
    );
  };

  const filteredJobs = jobs.filter(job => {
    const matchesTab = activeTab === 'all' || (activeTab === 'saved' && job.is_saved);

    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJobType = filters.jobType === 'all' || job.type === filters.jobType;

    const matchesLocation =
      filters.location === 'all' ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesTab && matchesSearch && matchesJobType && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />

      <div className="container mx-auto flex flex-1 px-4 py-6">
        <Sidebar className="sticky top-16 hidden w-1/5 lg:block" />

        <div className="w-full px-0 sm:px-4 lg:w-4/5">
          {selectedJob ? (
            <div>
              {/* Job details */}
              <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
                  <div>
                    <div className="mb-2 flex items-center">
                      {selectedJob.company.logo_url ? (
                        <Image
                          src={selectedJob.company.logo_url}
                          alt={selectedJob.company.name}
                          width={60}
                          height={60}
                          className="mr-4 rounded-lg"
                        />
                      ) : (
                        <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xl text-gray-700">
                          {getInitials(selectedJob.company.name)}
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl font-bold">{selectedJob.title}</h1>
                        <p className="text-lg text-gray-600">{selectedJob.company.name}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        {selectedJob.type}
                      </span>
                      <span className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                        <FaMapMarkerAlt className="mr-1" />
                        {selectedJob.location}
                      </span>
                      {selectedJob.salary_range && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          {selectedJob.salary_range}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2 md:mt-0">
                    <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                      Apply Now
                    </button>
                    <button
                      onClick={() => handleSaveJob(selectedJob.id)}
                      className={`flex items-center rounded-md px-4 py-2 font-semibold ${
                        selectedJob.is_saved
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaBookmark className="mr-2" />
                      {selectedJob.is_saved ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Back to Jobs
                    </button>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Posted:</span> {formatTimeAgo(selectedJob.posted_at)}
                  </div>
                  <div>
                    <span className="font-semibold">Deadline:</span> {formatDeadline(selectedJob.deadline)}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-semibold">Job Description</h2>
                  <p className="whitespace-pre-line text-gray-700">{selectedJob.description}</p>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold">Requirements</h2>
                  <ul className="list-inside list-disc space-y-1 text-gray-700">
                    {selectedJob.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Company info */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">About {selectedJob.company.name}</h2>
                <div className="flex items-start">
                  {selectedJob.company.logo_url ? (
                    <Image
                      src={selectedJob.company.logo_url}
                      alt={selectedJob.company.name}
                      width={80}
                      height={80}
                      className="mr-4 rounded-lg"
                    />
                  ) : (
                    <div className="mr-4 flex h-20 w-20 items-center justify-center rounded-lg bg-gray-200 text-2xl text-gray-700">
                      {getInitials(selectedJob.company.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{selectedJob.company.name}</h3>
                    <p className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-1" />
                      {selectedJob.company.location}
                    </p>
                    <p className="mt-2 text-gray-700">
                      This is a placeholder for company description. In a real application, this would contain information about the company, its culture, benefits, and other relevant details for job seekers.
                    </p>
                    <button className="mt-3 text-blue-600 hover:underline">
                      View Company Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Jobs</h1>
                <p className="text-gray-600">Find your next career opportunity</p>
              </div>

              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or locations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>

                <div className="flex gap-2">
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Job Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>

                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Locations</option>
                    <option value="remote">Remote</option>
                    <option value="san francisco">San Francisco</option>
                    <option value="new york">New York</option>
                    <option value="seattle">Seattle</option>
                    <option value="austin">Austin</option>
                    <option value="chicago">Chicago</option>
                  </select>

                  <button className="flex items-center rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300">
                    <FaFilter className="mr-2" />
                    More Filters
                  </button>
                </div>
              </div>

              <div className="mb-6 flex border-b border-gray-300">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'all'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Jobs
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'saved'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Saved Jobs
                </button>
              </div>

              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className="rounded-lg bg-white p-4 shadow transition-transform hover:scale-105 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div
                          className="mb-4 flex cursor-pointer items-center sm:mb-0"
                          onClick={() => setSelectedJob(job)}
                        >
                          {job.company.logo_url ? (
                            <Image
                              src={job.company.logo_url}
                              alt={job.company.name}
                              width={60}
                              height={60}
                              className="mr-4 rounded-lg"
                            />
                          ) : (
                            <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xl text-gray-700">
                              {getInitials(job.company.name)}
                            </div>
                          )}
                          <div>
                            <h2
                              className="text-lg font-semibold hover:text-blue-600"
                              onClick={() => setSelectedJob(job)}
                            >
                              {job.title}
                            </h2>
                            <p className="text-gray-600">{job.company.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FaMapMarkerAlt className="mr-1" />
                                {job.location}
                              </span>
                              <span>•</span>
                              <span>{job.type}</span>
                              {job.salary_range && (
                                <>
                                  <span>•</span>
                                  <span>{job.salary_range}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="ml-auto flex flex-col items-end">
                          <div className="mb-2 text-sm text-gray-500">
                            Posted {formatTimeAgo(job.posted_at)}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveJob(job.id)}
                              className={`flex items-center rounded-md px-3 py-1 text-sm ${
                                job.is_saved
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <FaBookmark className="mr-1" />
                              {job.is_saved ? 'Saved' : 'Save'}
                            </button>
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                            >
                              View Job
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="line-clamp-2 text-gray-700">{job.description}</p>
                      </div>

                      {job.deadline && (
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">Deadline:</span> {formatDeadline(job.deadline)}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg bg-white p-8 text-center shadow">
                    <p className="text-gray-600">
                      {activeTab === 'all'
                        ? 'No jobs found matching your criteria.'
                        : 'You have not saved any jobs yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
