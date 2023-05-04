/* This file contains helper functions to create an array of ids and frontmatter
 * for each file, bundles mdx using mdx-remote, and contains mdxOptions to modify 
 * plugins for remark and rehype. 
 * 
 * Available functions:
 * - getAllPostsIds 
 * */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { bundleMDX } from "mdx-bundler";

const postsDirectory = path.join(process.cwd(), 'posts'); // Tutorial

export function getAllPostIds() {
  // Creates an array of object that has a params key
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.mdx$/, ''),
      },
    };
  });
}

export function getAllPostPaths() {
  // Creates an array of object that has a params key
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    const id = fileName.replace(/\.mdx$/, '');
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const category = matterResult.data.category
    return {
      params: {
        id,
        category
      },
    };
  });
}

export function getSortedPostsData() { 
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get the id
    const id = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    // Combine the data with the id
    return {
      id,
      ...matterResult.data, 
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}


export async function getPostData(id){ // id passed 
    const fullPath = path.join(postsDirectory, `${id}.mdx`) //`` used
    const source = fs.readFileSync(fullPath, "utf8")

    const {code, frontmatter } = await bundleMDX({
        source: source, // updated bundleMDX
        mdxOptions(options) {
            // Default remark and rehype used, but can add custom plugins
            options.remarkPlugins = [...(options.remarkPlugins ?? [])];
            options.rehypePlugins = [...(options.rehypePlugins ?? [])];
            return options
        },
    });

    const category = frontmatter.category
    return {
        id,
        category,
        frontmatter,
        code
    }
}