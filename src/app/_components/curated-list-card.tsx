import type { ReactNode, PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { type CuratedListSelect } from "~/server/db/schema";

const formatContentDescription = (contentType: string, length: number) => {
  let types = contentType.split(",");

  if (length > 1) {
    types = types.map((item) => `${item}s`);
  }

  return `${length} ${types.join("/")}`;
};

interface CuratedListCardProps
  extends PropsWithChildren<
    Pick<CuratedListSelect, "title" | "contentType" | "length" | "description">
  > {
  actions?: ReactNode;
}

export const CuratedListCard = ({
  children,
  actions,
  ...list
}: CuratedListCardProps) => {
  return (
    <Card>
      <CardHeader className="flex-row items-baseline justify-between gap-2 space-y-0">
        <CardTitle>{list.title}</CardTitle>
        <CardDescription>
          {formatContentDescription(list.contentType, list.length)}
        </CardDescription>
      </CardHeader>
      {(!!children || !!list.description) && (
        <CardContent>
          {list.description}
          {children}
        </CardContent>
      )}
      <CardFooter className="flex-row-reverse gap-3">{actions}</CardFooter>
    </Card>
  );
};
