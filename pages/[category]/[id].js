
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

    return (
        <article>
            {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn" crossorigin="anonymous"></link> */}
            <header>
                <h1>{frontmatter.title}</h1>
                <p>{frontmatter.category.charAt(0).toUpperCase() + frontmatter.category.substr(1)} | <Date dateString={frontmatter.publishedAt}/></p>
            </header>
            <Component />
        </article>
    );
}

