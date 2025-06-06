import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: string }) {
  const posts = await getCollection("posts");

  return rss({
    title: "2tap2.be",
    description: "linux, open source and nerd stuff",
    site: context.site,
    stylesheet: "/rss-styles.xsl", // optional, if you want styling
    items: posts.map((post) => {
      const slug = post.slug ?? post.id; // adjust based on your setup
      const url = `${context.site}/posts/${slug}`;
      return {
        title: post.data.title,
        pubDate: post.data.published,
        link: url,
        guid: url,
        description: post.data.description ?? "", // optional
      };
    }),
  });
}
