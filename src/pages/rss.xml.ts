import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: string }) {
  const posts = await getCollection("posts");
  return rss({
    title: "2tap2.be",
    description: "linux, open source and nerd stuff",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published,
    })),
  });
}
