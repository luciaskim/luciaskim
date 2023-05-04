
import React, { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { getAllPostPaths, getPostData } from "../../lib/posts";
import Date from "../../components/date";

export async function getStaticPaths() {
  const paths = getAllPostPaths();
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      ...postData,
    },
  };
};

  

export default function Post({ code, frontmatter }) {
    const Component = useMemo(() => getMDXComponent(code), [code]); 
    // Memoises components to improve speed, custom name Component
    
    return (
        <article>
            <header>
                <h1>{frontmatter.title}</h1>
                <p>{frontmatter.category.charAt(0).toUpperCase() + frontmatter.category.substr(1)} | <Date dateString={frontmatter.publishedAt}/></p>
            </header>
            <Component />
        </article>
    );
}

