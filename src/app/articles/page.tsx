"use client";
import { buttonVariants } from "@/components/ui/button";
import { createArticle } from "@/service/articles/mutations";
import { getArticles } from "@/service/articles/queries";
import { UploadButton } from "@/utils/uploadthing";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

export default function ArticlesPage() {
  const { data: articles, isFetching } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const queryClient = useQueryClient();

  function handleUploadComplete(data: any) {
    toast.promise(
      () => createArticle({ ...data, author: data?.author ?? "No author" }),
      {
        success: () => {
          queryClient.invalidateQueries({ queryKey: ["articles"] });

          return "Articles created successfully";
        },
        error: (err) => `Error creating articles: ${err}`,
        loading: "Creating articles...",
      }
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
          <div className="">
            <h1 className="text-3xl font-bold">Articles</h1>
            <p className="mt-2 text-gray-600">
              Here you can find a list of available articles.
            </p>
          </div>

          {/* chat link button */}
          <div className="flex items-center">
            <Link
              href="/"
              className={buttonVariants({
                variant: "secondary",
              })}
            >
              Chat with AI
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-8">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);

            handleUploadComplete(res[0].serverData.articleData);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            toast.error(`ERROR! ${error.message}`);
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold">Articles List</h2>
        <ul className="mt-4">
          {articles?.map((article) => (
            <li key={article._id} className="mb-4">
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="text-gray-600">{article.author}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Article
              </a>
            </li>
          ))}
        </ul>

        {isFetching && (
          <div className="flex items-center justify-center mt-4">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5 0a5.5 5.5 0 1 0 11 0A5.5 5.5 0 0 0 6.5 12z"
              />
            </svg>
          </div>
        )}
      </div>
    </main>
  );
}
