import ApplyButton from "@/components/ApplyButton";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function JobPage({
    params,
}:
    {
    params: Promise <{ id: string }>
    }) {
    const jobId = (await params).id;

    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {postedBy: true},

    });

    if(!job) {
        notFound()
    }

    return (
      <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <Link
          href="/jobs"
          className="inline-block mb-4 text-indigo-600 hover:text-indigo-500 font-medium"
        >
          ← Back to Jobs
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-600">{job.company}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" />
            </svg>
            {job.location}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 2h8v4H6V2zm-2 6h12v10H4V8z" />
            </svg>
            {job.type}
          </span>
          {job.salary && (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 1v18m-4-4h8" />
                </svg>
                {job.salary}
              </span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span className="font-medium text-gray-700">{job.postedBy.name}</span>
          <span className="mx-2">•</span>
          <time className="italic">
            {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
          </time>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Job Description
          </h2>
          <div className="prose prose-sm text-gray-700">{job.description}</div>
        </section>

        <div className="mt-8 border-t border-gray-200">
          <ApplyButton jobId={job.id} />
        </div>
      </div>
    );
}