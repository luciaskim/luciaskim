
import React, { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";

export async function getStaticPaths() {
  const paths = getAllPostIds();
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
                <p><Date dateString={frontmatter.publishedAt}/></p>
            </header>
            <Component />
        </article>
    );
}