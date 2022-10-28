import { GetStaticProps } from 'next'
import Head from 'next/head'
import { getPrismicClient } from '../../services/prismic'
import {RichText} from 'prismic-dom'

import styles from './styles.module.scss'
import Link from 'next/link'

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updateAt:string;
}

interface PostsProps{
  myPosts:Post[]
}

export default function Posts({myPosts}:PostsProps){
  return(
    <>
    <Head>
      <title>Posts | Ignews</title>
    </Head>
    <main className={styles.container}>
      <div className={styles.posts}>
        {myPosts.map( post => (
          <Link href={`/posts/preview/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updateAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>  
            </a>
          </Link>
        ))}
      
     
      
      </div>
    </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const posts = await prismic.getByType("post", {
    pageSize: 100,
  });

  console.log(JSON.stringify(posts, null, 2));
  
  const myPosts = posts.results.map( post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }) 
    }
  })

  return {
    props: { myPosts },
  };
}