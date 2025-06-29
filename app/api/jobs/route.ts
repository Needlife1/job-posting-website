import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return NextResponse.redirect(new URL ("/auth/signin", request.url));
    }

    try {
        const data = await request.json();

        const job = await prisma.job.create({
            data: {
                ...data,
                postedById: session.user.id,
            }
        })

        return NextResponse.json(job);
    } catch (error) {
        console.error("Error posting job:", error);
        return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
    }
}
 
export async function GET() {
 try {
    const job = await prisma.job.findMany({
      orderBy: {
        postedById: "desc",
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json({ error: 'Failed to post job' }, { status: 500 });
  }
}