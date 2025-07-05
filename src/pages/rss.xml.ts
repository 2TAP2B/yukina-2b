import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site: string }) {
  const posts = await getCollection("posts", ({ data }) => {
    return data.draft !== true; // Only include published posts
  });

  // Sort posts by published date (newest first)
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.data.published).getTime() - new Date(a.data.published).getTime()
  );

  return rss({
    title: "2tap2.be",
    description: "Linux, Open-Source & Nerd Stuff - Self-hosting tutorials and tech guides",
    site: context.site,
    stylesheet: "/rss-styles.xsl",
    items: sortedPosts.map((post) => {
      const slug = post.id;
      const siteUrl = String(context.site || 'https://2tap2.be');
      const baseUrl = siteUrl.charAt(siteUrl.length - 1) === '/' ? siteUrl.slice(0, -1) : siteUrl;
      const url = `${baseUrl}/posts/${slug}`;
      return {
        title: post.data.title,
        pubDate: post.data.published,
        link: url,
        guid: url,
        description: post.data.description ?? `Read more about ${post.data.title}`,
        categories: post.data.tags || [],
        author: post.data.author || "Tobias",
      };
    }),
  });
}
