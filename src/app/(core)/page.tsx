import PostEditor from "@/components/posts/editor/PostEditor";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {
  return (
    <div className="w-full min-w-0 flex-shrink-0">
      <div className="w-full space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
    </div>
  );
}
