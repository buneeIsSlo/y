import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: {
      maxFileSize: "1024KB",
    },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized request");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
