import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import { db } from '../../db';
import { topics } from '../../schema/topics';
import { auth } from '../../auth';
import { getHeaders, getWebRequest } from '@tanstack/react-start/server';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/topics/new')({
  component: RouteComponent,
});

const createTopic = createServerFn()
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data');
    }

    const title = data.get('title')?.toString() || '';
    if (title.trim() === '') {
      throw new Error('Title is required');
    }
    const description = data.get('description')?.toString() || '';

    if (description.trim() === '') {
      throw new Error('Description is required');
    }

    return { title, description };
  })
  .handler(async ({ data }) => {
    const { title, description } = data;
    const req = getWebRequest();

    if (!req) {
      throw new Error('Request is not available');
    }

    const session = await auth.api.getSession({ headers: req?.headers });

    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    await db.insert(topics).values({
      title,
      description,
      createdBy: session.user.id,
    });

    throw redirect({ to: '/topics' });
  });

function RouteComponent() {
  const createNewTopic = useServerFn(createTopic);
  const nav = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createNewTopic({ data: formData });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating topic:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description"></textarea>
      </div>
      <button>Create Topic</button>
      <button type="button" onClick={() => nav({to: '/topics'})}>
        Cancel
      </button>
    </form>
  );
}
