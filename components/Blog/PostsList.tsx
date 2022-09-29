import React from 'react';
import dayjs from 'dayjs';
import { FindPostsQuery } from '../../pages/api/__graphql__/FindPostsQuery';
import { NextPage } from 'next';
import Link from 'next/link';

interface IPostsListProps {
  data: FindPostsQuery | undefined;
}

export const PostsList: NextPage<IPostsListProps> = ({ data }) => {
  return (
    <div className="flex flex-col divide-y my-5 dark:divide-gray-500">
      {data ? (
        data.findAllPosts.posts?.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <a className="py-6 px-5 hover:dark:bg-gray-900 hover:bg-gray-100 transition-colors">
              <p className="text-md mb-3 text-gray-500">{post.category?.name || '-'}</p>
              <p className="text-3xl mb-5">{post.title}</p>
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-500">{post.author?.username}</span>
                <span className="text-md text-gray-500">{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</span>
              </div>
            </a>
          </Link>
        ))
      ) : (
        <div>Posts not found!</div>
      )}
    </div>
  );
};