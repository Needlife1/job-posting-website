import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
  const recentJobs = await prisma.job.findMany({
    take: 3,
    orderBy: { postedDate: 'desc' },
    include: {
      postedBy: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="space-y-12">
      <section className="text-center py-20 bg-white rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover thousands of job opportunities with top companies
        </p>
        <Link
          href="/jobs"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition"
        >
          Browse Jobs
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Jobs</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 mb-2">{job.company}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
                <svg
                  className="w-4 h-4 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                <span>{job.location}</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4 space-x-2">
                <svg
                  className="w-4 h-4 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 2a2 2 0 00-2 2v2H3a1 1 0 000 2h14a1 1 0 000-2h-1V4a2 2 0 00-2-2H6zm2 4V4h4v2H8zM4 8v8a2 2 0 002 2h8a2 2 0 002-2V8H4z" />
                </svg>
                <span>{job.type}</span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>

              <Link
                href={`/jobs/${job.id}`}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition"
              >
                View Details
                <svg
                  className="w-4 h-4 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/jobs"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            View All Jobs
            <svg
              className="w-4 h-4 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
