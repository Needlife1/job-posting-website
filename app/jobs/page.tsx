import { prisma } from '@/lib/prisma';
import Link from 'next/link';


export default async function jobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q, type, location } = await searchParams;

  const query = q as string | undefined;
  const searchType = type as string | undefined;
  const searchLocation = location as string | undefined;

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { company: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        type ? { type: searchType } : {},
        searchLocation
          ? {
              location: {
                contains: searchLocation,
                mode: 'insensitive',
              },
            }
          : {},
      ],
    },
    orderBy: {
      postedById: 'desc',
    },
    include: {
      postedBy: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Find Job
        </h1>
        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="q"
            placeholder="Search jobs..."
            className="col-span-1 sm:col-span-2 lg:col-span-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            name="type"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id}>
            <div className="max-w-xl mx-auto my-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {job.title}
                  </h2>
                  <p className="text-gray-600">{job.company}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6 2h8v4H6V2zm-2 6h12v10H4V8z" />
                    </svg>
                    {job.type}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {job.description}
                </p>

                {job.salary && (
                  <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    💰 {job.salary}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <span>
                  Posted by{' '}
                  <span className="font-medium text-gray-700">
                    {job.postedBy.name}
                  </span>
                </span>
                <Link
                  href={`/jobs/${job.id}`}
                  className="
    inline-flex items-center gap-1.5 
    text-indigo-600 hover:text-indigo-500 
    font-medium transition
  "
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
