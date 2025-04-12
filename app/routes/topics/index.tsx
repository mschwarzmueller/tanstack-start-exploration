import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { desc, sql } from 'drizzle-orm';

import { db } from '../../db';
import { topics, votes } from '../../schema/topics';

export const Route = createFileRoute('/topics/')({
  component: RouteComponent,
  loader: async () => getTopics()
});

const getTopics = createServerFn().handler(async () => {
  const fetchedTopics = await db.query.topics.findMany({
    orderBy: desc(topics.createdAt),
    columns: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
    with: {
      creator: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    extras: {
      votes:
        sql<number>`(SELECT COUNT(*) FROM ${votes} WHERE ${votes.topicId} = ${topics.id})`.as(
          'votes'
        ),
    },
  });

  return {
    topics: fetchedTopics,
  };
})

function RouteComponent() {
  const { topics } = Route.useLoaderData();

  return (
    <>
      <div>
        <Link to="/topics/new">Create New Topic</Link>
      </div>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <p>Created by: {topic.creator.name}</p>
            <p>{topic.votes}</p>
            {/* <p>Created at: {new Date(topic.createdAt).toLocaleString()}</p> */}
          </li>
        ))}
      </ul>
    </>
  );
}
