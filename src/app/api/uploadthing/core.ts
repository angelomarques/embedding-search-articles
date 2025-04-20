import { generateEmbedding } from "@/utils/embeddings";
import { GoogleGenAI, Type } from "@google/genai";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    // .middleware(async ({ req }) => {
    //   // This code runs on your server before upload
    //   const user = await auth(req);

    //   // If you throw, the user will not be able to upload
    //   if (!user) throw new UploadThingError("Unauthorized");

    //   // Whatever is returned here is accessible in onUploadComplete as `metadata`
    //   return { userId: user.id };
    // })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload
      //   console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.key);

      try {
        const fileUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${file.key}`;

        const ai = new GoogleGenAI({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        });

        console.log("fetching document buffer");
        const pdfResp = await fetch(fileUrl).then((response) =>
          response.arrayBuffer()
        );

        const pdfFileModelInput = {
          inlineData: {
            mimeType: "application/pdf",
            data: Buffer.from(pdfResp).toString("base64"),
          },
        };

        const contents = [
          {
            text: "Retrieve information about the article.",
          },
          pdfFileModelInput,
        ];

        console.log("fetching document information");
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                author: {
                  type: Type.STRING,
                  description: "Author of the article",
                  nullable: false,
                },
                title: {
                  type: Type.STRING,
                  description: "Title of the article",
                  nullable: false,
                },
              },
              required: [],
            },
          },
        });

        const markdownInputContents = [
          {
            text: "Convert the article to markdown.",
          },
          pdfFileModelInput,
        ];

        console.log("fetching document content in markdown");
        const contentResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: markdownInputContents,
        });

        const info = JSON.parse(response.text ?? "{}");
        console.log("convert document to embedding", info);
        const embedding = await generateEmbedding(contentResponse.text ?? "");

        console.log("success");

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return {
          articleData: {
            title: info.title,
            author: info.author,
            content: contentResponse.text,
            embedding,
            url: fileUrl,
          },
        };
      } catch (err) {
        throw new UploadThingError(JSON.stringify(err));
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
