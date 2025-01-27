import Link from "next/link";
import { LinkItUrl, LinkIt } from "react-linkify-it";
import UserLinkWithToolTip from "./UserLinkWithTooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[0-9a-zA-Z_-]+)/}
      component={(match, key) => (
        <UserLinkWithToolTip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithToolTip>
      )}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[0-9a-zA-Z_-]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/topic/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
