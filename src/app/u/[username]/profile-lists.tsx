"use client";

import { ListTemplateCard } from "~/app/_components/curated-list-card";
import { ContentItem } from "~/app/_components/music/content-item";
import { api } from "~/trpc/react";

interface ListCardProps {
  list_template: {
    length: number;
    id: number;
    title: string;
    description: string | null;
    content_type: string;
  };
  contents: {
    content: {
      id: number;
      content_type: string;
      name: string;
      artist: string;
      image_url: string;
      external_url: string;
    };
  }[];
}

export const ProfileLists = () => {
  const query = api.userLists.getAllListsByUser.useQuery();

  return (
    <div className="flex flex-col gap-3">
      {query.data?.lists.map((list) => (
        <ListCard key={list.list_template.id} {...list} />
      ))}
    </div>
  );
};

const ListCard = ({ list_template, contents }: ListCardProps) => {
  return (
    <ListTemplateCard {...list_template}>
      {contents.map(({ content }) => (
        <ContentItem key={content.id} {...content} />
      ))}
    </ListTemplateCard>
  );
};
