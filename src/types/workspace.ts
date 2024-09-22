import { UserType } from "./user";

type WorkspaceType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  members: UserType[];
  owner: string;
  updatedAt: string;
  createdAt: string;
};

export type { WorkspaceType };

export const DEMO_WORKSPACE_DATA: WorkspaceType[] = [
  {
    id: "wk-1",
    title: "Icebox",
    slug: "icebox",
    description: "Workspace for players to understand Icebox map",
    owner: "user-1",
    members: [
      {
        id: "user-1",
        name: "Deepak",
        email: "deepak@mail.co",
        avatar:
          "https://yt3.ggpht.com/ytc/AIdro_mIGlqIYYtCZsZjLU94fyeijqO7zN80pJGCEL9w-uNr2PTUIGNAmRqf5z40HG5jVFRm1w=s88-c-k-c0x00ffffff-no-rj",
        createdAt: "2024-04-28T19:11:39.394Z",
        updatedAt: "2024-04-28T19:11:39.394Z",
      },
      {
        id: "user-2",
        name: "Som",
        email: "som@oh.in",
        avatar:
          "https://yt3.ggpht.com/FH75RGGrUWXjB2UkyjN1yX6H3oQ42KzuCgpLqxo4dMJ1gc03e_wSAZpwT32OhqH5rSG3Bsw1cJU=s68-c-k-c0x00ffffff-no-rj",
        createdAt: "2024-04-28T19:11:39.394Z",
        updatedAt: "2024-04-28T19:11:39.394Z",
      },
    ],
    createdAt: "2024-04-28T19:11:39.394Z",
    updatedAt: "2024-04-28T19:11:39.394Z",
  },
  {
    id: "wk-2",
    title: "Time Machine",
    slug: "time-machine",
    description: "Workspace for players to understand Icebox map",
    owner: "user-2",
    members: [
      {
        id: "user-1",
        name: "Deepak",
        email: "deepak@mail.co",
        avatar:
          "https://yt3.ggpht.com/ytc/AIdro_mIGlqIYYtCZsZjLU94fyeijqO7zN80pJGCEL9w-uNr2PTUIGNAmRqf5z40HG5jVFRm1w=s88-c-k-c0x00ffffff-no-rj",
        createdAt: "2024-04-28T19:11:39.394Z",
        updatedAt: "2024-04-28T19:11:39.394Z",
      },
      {
        id: "user-3",
        name: "Void",
        email: "void@mail.co",
        avatar: "https://owcdn.net/img/64168fe1322dd.png",
        createdAt: "2024-04-28T19:11:39.394Z",
        updatedAt: "2024-04-28T19:11:39.394Z",
      },
      {
        id: "user-2",
        name: "Som",
        email: "som@oh.in",
        avatar:
          "https://yt3.ggpht.com/FH75RGGrUWXjB2UkyjN1yX6H3oQ42KzuCgpLqxo4dMJ1gc03e_wSAZpwT32OhqH5rSG3Bsw1cJU=s68-c-k-c0x00ffffff-no-rj",
        createdAt: "2024-04-28T19:11:39.394Z",
        updatedAt: "2024-04-28T19:11:39.394Z",
      },
    ],
    createdAt: "2024-04-28T19:11:39.394Z",
    updatedAt: "2024-04-28T19:11:39.394Z",
  },
];
