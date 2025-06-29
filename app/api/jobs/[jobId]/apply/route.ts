import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise <{ jobId: string }> }) {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return NextResponse.redirect(new URL ("/auth/signin", request.url));
    }

    try {
        const { jobId } = await params;
        const job = await prisma.job.findUnique({
          where: {
            id: jobId,
          },
        });

        if (!job) {
            return new NextResponse("ob not found", { status: 404 });
        }

        const existingApplication = await prisma.application.findFirst({
            where: {
                jobId: job.id,
                userId: session.user.id,
            },
        })

        if (existingApplication) {
            return new NextResponse(
              'You have already applied for this job.', { status: 400 });
        }

        const Application = await prisma.application.create({
            data: {
                jobId: jobId,
                userId: session.user.id,
                status: 'PENDING',
            },
        })

        return NextResponse.json(Application);
    } catch (error) {
        console.error("Error posting job:", error);
        return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
    }
}