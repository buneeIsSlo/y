import PostEditor from "@/components/posts/editor/PostEditor";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import TrendingSidebar from "@/components/TrendingSidebar";

export default async function Home() {
  return (
    <div className="flex gap-4">
      <div className="w-full space-y-4 py-4 sm:max-w-[600px] xl:max-w-none">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendingSidebar />
    </div>
  );
}
