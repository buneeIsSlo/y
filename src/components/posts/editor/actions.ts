"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostScema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized request");
  }

  const { content } = createPostScema.parse({ content: input });

  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });

  /* path will be revalidated using tanstack query */
}
