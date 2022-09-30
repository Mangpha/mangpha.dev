import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AddCategory } from '../../components/Blog/AddCategory';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Loading } from '../../components/Loading';
import { MarkDownView } from '../../components/Blog/MarkDownView';
import { useRouter } from 'next/router';
import { CreatePostMutation, CreatePostMutationVariables } from '../api/__graphql__/CreatePostMutation';
import { CREATE_POST_MUTATION, FIND_ALL_CATEGORY_QUERY, FIND_POSTS_QUERY, MY_DATA_QUERY } from '../api/gql';
import { FindAllCategoryQuery } from '../api/__graphql__/FindAllCategoryQuery';
import { SEO } from '../../components/SEO';
import { GetServerSideProps } from 'next';
import { client } from '../../apollo';
import { MyDataQuery } from '../api/__graphql__/MyDataQuery';
import { UserRoles } from '../api/__graphql__/globalTypes';

interface IPostProps {
  title: string;
  content: string;
  category?: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { data: myData } = await client.query<MyDataQuery>({
      query: MY_DATA_QUERY,
    });
    console.log(myData.myData.role);
    if (myData.myData.role !== UserRoles.Admin) {
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        },
      };
    }
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }

  return {
    props: {},
  };
};

const CreatePost = () => {
  const router = useRouter();
  if (router.isFallback)
    return (
      <>
        <Loading />
      </>
    );
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<boolean>(false);
  const {
    getValues,
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
  } = useForm<IPostProps>({ mode: 'onChange' });
  const { content } = watch();
  const [createPostMutation, { loading }] = useMutation<CreatePostMutation, CreatePostMutationVariables>(CREATE_POST_MUTATION, {
    onCompleted: () => {
      alert('Created a Post!');
      router.back();
    },
    refetchQueries: [
      {
        query: FIND_POSTS_QUERY,
        variables: {
          input: { page: 1 },
        },
      },
    ],
  });
  const { data: categoryData } = useQuery<FindAllCategoryQuery>(FIND_ALL_CATEGORY_QUERY);
  const onSubmit = () => {
    const { title, content, category } = getValues();
    createPostMutation({
      variables: {
        input: {
          title,
          content,
          ...(category && { category: { name: category } }),
        },
      },
    });
  };
  const onFileUploadHandle = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!uploading) {
      const { files } = e.dataTransfer;
      const file = files[0];
      if (file.type.match(/^image/)) {
        if (file.size > 5242880) alert('The size of the file must not exceed 5MB.');
        else {
          // Uploading Code
          setUploading(true);
          const formData = new FormData();
          formData.append('file', file);
          const { url: imgUrl } = await (
            await fetch(`${process.env.REACT_APP_UPLOAD_POINT}/uploads`, {
              method: 'POST',
              body: formData,
            })
          ).json();
          setValue('content', content + `![${file.name}](${imgUrl})`);
          setUploading(false);
        }
      } else alert('Not Image');
    }
  };
  const onDragOverHandle = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const onDragEnterHandle = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="h-full min-h-screen section container_small">
      <SEO title="Create Post" />
      <div className="mb-5">
        <span className="cursor-pointer text-3xl px-2 py-1 hover:text-sky-400 hover:dark:text-sky-300 transition-colors" onClick={() => router.back()}>
          &larr;
        </span>
      </div>
      <div className="w-full h-full">
        <div className="py-2 px-3 bg-gray-200 dark:bg-gray-800 text-center" onClick={() => setPreview(!preview)}>
          Content Preview {preview ? 'OFF' : 'ON'}
        </div>
        {preview ? (
          <div className="px-5 divide-y dark:divide-gray-500">
            <div className="flex flex-col my-3 px-8">
              <p className="text-lg text-gray-500 mb-3">{getValues().category || '-'}</p>
              <p className="text-4xl mb-5">{getValues().title || 'Please input Title'}</p>
              <div className="flex">
                <span className="text-gray-500">{`${new Date().getHours()}:${new Date().getMinutes()}, ${new Date().toDateString()}`}</span>
              </div>
            </div>
            <div className="row-span-5">
              <MarkDownView content={content} />
            </div>
          </div>
        ) : (
          <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
            <>
              <div className="my-2 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div className="p-4 bg-white rounded-b-lg dark:bg-gray-800">
                  <input
                    {...register('title', {
                      required: 'Please input title',
                      minLength: 5,
                    })}
                    id="title"
                    name="title"
                    className="block focus:outline-none px-0 w-full text-xl text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                    placeholder="Title"
                  />
                </div>
              </div>
              {errors.title?.message && <ErrorMessage error={errors.title.message} />}
              {errors.title?.type === 'minLength' && <ErrorMessage error="Title must be more than 5 chars." />}
              {uploading && <Loading />}
              <div className="my-2 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
                  <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                    <div className="flex items-center space-x-1 sm:pr-4">
                      <button
                        type="button"
                        onClick={() => setValue('content', content + '![]()')}
                        className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                        </svg>
                        <span className="sr-only">Upload image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('content', content + '\n~~~\n\n~~~')}
                        className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path
                            fillRule="evenodd"
                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Code</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                      <button
                        type="button"
                        onClick={() => setValue('content', content + '<p style="text-align:center"></p>')}
                        className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                      >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Align Center</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
                  <textarea
                    {...register('content', {
                      required: 'Input content',
                      minLength: 10,
                    })}
                    id="content"
                    rows={20}
                    name="content"
                    className="block focus:outline-none px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 whitespace-pre-wrap"
                    placeholder="Write an article"
                    onDrop={onFileUploadHandle}
                    onDragOver={onDragOverHandle}
                    onDragEnter={onDragEnterHandle}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        setValue('content', content + '\t');
                      }
                    }}
                  />
                </div>
              </div>
              {errors.content?.message && <ErrorMessage error={errors.content.message} />}
              {errors.content?.type === 'minLength' && <ErrorMessage error="Content must be more than 10 chars." />}
              <div className="mt-2 flex flex-col w-1/2">
                {categoryData && (
                  <select
                    {...register('category')}
                    id="category"
                    name="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Choose a category</option>
                    {categoryData.findAllCategories.categories?.map((category, idx) => (
                      <option key={idx} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <AddCategory />
              <Button loading={loading} canClick={isValid} text="Publish post" />
            </>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
