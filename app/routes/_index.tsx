/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentfulLivePreview } from "@contentful/live-preview";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@shopify/remix-oxygen";
import { GraphQLClient, gql } from "graphql-request";

const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

const contentful = new GraphQLClient(endpoint);

const getPageQuery = gql`
  query Page($preview: Boolean!) {
    pageCollection(preview: $preview) {
      items {
        # typename and sys.id are required for live preview
        __typename
        sys {
          id
        }
        slug
        title
        description
      }
    }
  }
`;

export async function loader() {
  console.log("in loader");
  if (process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    throw new Error("Missing preview token");
  }

  const locale = "en-US";
  const layout = await contentful.request(
    getPageQuery,
    { preview: true },
    {
      authorization: `Bearer ${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN}`,
    }
  );

  // if (!params.handle) {
  //   throw new Error("Missing page handle");
  // }

  return json({ layout, locale });
}

type Item = {
  sys: { id: string };
  title: string;
};

type Layout = {
  layout: {
    pageCollection: {
      items: {
        sys: { id: string };
        title: string;
        description: string;
        blocksCollection: {
          items: Item[];
        };
      }[];
    };
  };
  locale: string;
};

export default function Page() {
  const { layout, locale } = useLoaderData<Layout>();

  console.log("====================================");
  console.log({ layout });
  console.log("====================================");
  const updatedEntries = useContentfulLiveUpdates(layout?.pageCollection);
  console.log({ updatedEntries });
  if (!updatedEntries) {
    return <div>, loading...</div>;
  }
  return (
    <div className="page">
      <header>
        <h1
          {...ContentfulLivePreview.getProps({
            entryId: updatedEntries?.items[0]?.sys?.id,
            fieldId: "title",
            locale: locale,
          })}
        >
          {updatedEntries?.items[0]?.title}
        </h1>
        <h2
          {...ContentfulLivePreview.getProps({
            entryId: updatedEntries?.items[0]?.sys?.id,
            fieldId: "description",
            locale: locale,
          })}
        >
          {updatedEntries?.items[0]?.description}
        </h2>
      </header>

      <div>
        {updatedEntries?.items[0]?.blocksCollection?.items.map((item: Item) => (
          <Block item={item} key={item?.sys?.id} />
        ))}
      </div>
    </div>
  );
}

const Block = ({ item }: { item: { sys?: { id: string }; title: string } }) => {
  console.log({ item });
  const { locale } = useLoaderData<Layout>();

  return (
    <div className="m-2">
      <h1
        {...ContentfulLivePreview.getProps({
          entryId: item?.sys?.id,
          fieldId: "title",
          locale: locale,
        })}
      >
        {item?.title}
      </h1>
    </div>
  );
};
