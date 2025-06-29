import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const [applications, postedJobs] = await Promise.all([
    // applications query
    prisma.application.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          include: {
            postedBy: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    }),

    //jobs query
    prisma.job.findMany({
      where: { postedById: session.user.id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { postedDate: 'desc' },
    }),
  ]);

  return (
    <div className={'max-w-7xl mx-auto px-4 sm:px-6 lg:mx-8 py-8'}>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Posted Jobs</h2>
            <Link
              href={'/jobs/post'}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Post New Job
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {postedJobs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                You have not posted any jobs yet.
              </div>
            ) : (
              postedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" />
                      </svg>
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M6 2h8v4H6V2zm-2 6h12v10H4V8z" />
                      </svg>
                      {job.type}
                    </span>
                    <span>•</span>
                    <time className="italic">
                      {formatDistanceToNow(new Date(job.postedDate), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>

                  <p className="text-gray-700 line-clamp-3 mb-3">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Applications: {job._count.applications}</span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      View Job →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto my-8 px-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Your Applications
          </h2>

          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {applications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                You haven’t applied to any jobs yet.
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="p-6 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition"
                >
                  {/* Job Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {application.job.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {application.job.company}
                    </p>

                    <div className="flex flex-wrap items-center text-sm text-gray-500 gap-2">
                      <span>{application.job.location}</span>
                      <span className="mx-1">•</span>
                      <span>{application.job.type}</span>
                      <span className="mx-1">•</span>
                      <span>
                        Applied{' '}
                        {formatDistanceToNow(new Date(application.appliedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 md:mt-0">
                    <span
                      className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                ${
                  application.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : application.status === 'ACCEPTED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }
              `}
                    >
                      {application.status}
                    </span>

                    <Link
                      href={`/jobs/${application.job.id}`}
                      className="inline-block text-indigo-600 hover:text-indigo-500 font-medium transition"
                    >
                      View Job →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
