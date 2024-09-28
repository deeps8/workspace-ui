import { UserType } from "./user";

type WorkspaceType = {
  id: string;
  name: string;
  overview: string;
  slug: string;
  owner: string;
  members: Omit<UserType, "created_at" | "updated_at">[];
  ownerdetails: Omit<UserType, "created_at" | "updated_at">;
  updated_at: string;
  created_at: string;
};

export type { WorkspaceType };

export const DEMO_WORKSPACE_DATA: WorkspaceType[] = [
  {
    id: "wk-1",
    name: "Icebox",
    slug: "icebox",
    overview: "Workspace for players to understand Icebox map",
    owner: "user-1",
    ownerdetails: {
      id: "user-1",
      email: "deepak@mail.co",
      name: "Deepak",
      picture:
        "https://yt3.ggpht.com/ytc/AIdro_mIGlqIYYtCZsZjLU94fyeijqO7zN80pJGCEL9w-uNr2PTUIGNAmRqf5z40HG5jVFRm1w=s88-c-k-c0x00ffffff-no-rj",
    },
    members: [
      {
        id: "user-1",
        name: "Deepak",
        email: "deepak@mail.co",
        picture:
          "https://yt3.ggpht.com/ytc/AIdro_mIGlqIYYtCZsZjLU94fyeijqO7zN80pJGCEL9w-uNr2PTUIGNAmRqf5z40HG5jVFRm1w=s88-c-k-c0x00ffffff-no-rj",
      },
      {
        id: "user-2",
        name: "Som",
        email: "som@oh.in",
        picture:
          "https://yt3.ggpht.com/FH75RGGrUWXjB2UkyjN1yX6H3oQ42KzuCgpLqxo4dMJ1gc03e_wSAZpwT32OhqH5rSG3Bsw1cJU=s68-c-k-c0x00ffffff-no-rj",
      },
    ],
    created_at: "2024-04-28T19:11:39.394Z",
    updated_at: "2024-04-28T19:11:39.394Z",
  },
  {
    id: "wk-2",
    name: "Time Machine",
    slug: "time-machine",
    overview: "Workspace for players to understand Icebox map",
    owner: "user-2",
    ownerdetails: {
      id: "user-1",
      email: "deepak@mail.co",
      name: "Deepak",
      picture:
        "https://yt3.ggpht.com/ytc/AIdro_mIGlqIYYtCZsZjLU94fyeijqO7zN80pJGCEL9w-uNr2PTUIGNAmRqf5z40HG5jVFRm1w=s88-c-k-c0x00ffffff-no-rj",
    },
    members: [
      {
        id: "user-1",
        name: "Deepak",
        email: "deepak@mail.co",
        picture:
          "https://yt3.ggpht.com/ytc/AIdro_mIGlqIYYtCZsZjLU94fyeijqO7zN80pJGCEL9w-uNr2PTUIGNAmRqf5z40HG5jVFRm1w=s88-c-k-c0x00ffffff-no-rj",
      },
      {
        id: "user-3",
        name: "Void",
        email: "void@mail.co",
        picture: "https://owcdn.net/img/64168fe1322dd.png",
      },
      {
        id: "user-2",
        name: "Som",
        email: "som@oh.in",
        picture:
          "https://yt3.ggpht.com/FH75RGGrUWXjB2UkyjN1yX6H3oQ42KzuCgpLqxo4dMJ1gc03e_wSAZpwT32OhqH5rSG3Bsw1cJU=s68-c-k-c0x00ffffff-no-rj",
      },
    ],
    created_at: "2024-04-28T19:11:39.394Z",
    updated_at: "2024-04-28T19:11:39.394Z",
  },
];
