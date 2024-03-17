import {
  SOCIALS_DATA,
  SocialType,
} from "@/components/SocialsShare/SocialsShare";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  socials?: SocialType[];
}

const socialsDemo: SocialType[] = SOCIALS_DATA;

export const SOCIALS_2 = socialsDemo;

const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block",
  socials = socialsDemo,
}) => {
  return (
    <nav
      className={`nc-SocialsList text-neutral-6000 flex space-x-3 text-2xl dark:text-neutral-300 ${className}`}
    >
      <Button variant="ghost" size="icon" className="rounded-full">
        <Link href={"https://github.com/JHoo0118"}>
          <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
        </Link>
      </Button>
      {/* {socials.map((item, i) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
        >
          <div dangerouslySetInnerHTML={{ __html: item.icon || "" }}></div>
        </a>
      ))} */}
    </nav>
  );
};

export default SocialsList;
